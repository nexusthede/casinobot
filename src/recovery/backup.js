const fs = require("fs");
const path = require("path");

const Economy = require("../models/Economy");

const BACKUP_FOLDER = path.join(__dirname, "..", "backups");
const MAX_BACKUPS = 24;

if (!fs.existsSync(BACKUP_FOLDER)) {
    fs.mkdirSync(BACKUP_FOLDER, { recursive: true });
}

function timestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

async function createBackup() {

    try {

        const users = await Economy.find({}).lean();

        const backup = {
            version: 1,
            createdAt: new Date().toISOString(),
            totalUsers: users.length,
            data: users
        };

        const file = path.join(
            BACKUP_FOLDER,
            `backup-${timestamp()}.json`
        );

        fs.writeFileSync(
            file,
            JSON.stringify(backup, null, 2)
        );

        console.log(
            `[Backup] Saved ${users.length} profiles.`
        );

        rotateBackups();

    } catch (err) {

        console.error("[Backup] Failed to create backup.");
        console.error(err);

    }

}

function rotateBackups() {

    const files = fs.readdirSync(BACKUP_FOLDER)
        .filter(file => file.endsWith(".json"))
        .sort();

    while (files.length > MAX_BACKUPS) {

        const oldest = files.shift();

        fs.unlinkSync(
            path.join(BACKUP_FOLDER, oldest)
        );

        console.log(
            `[Backup] Deleted old backup: ${oldest}`
        );

    }

}

function startBackupScheduler() {

    console.log("[Backup] Scheduler started.");

    // Backup every hour
    setInterval(() => {

        createBackup();

    }, 60 * 60 * 1000);

}

module.exports = {
    createBackup,
    startBackupScheduler
};
