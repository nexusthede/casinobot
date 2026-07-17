const fs = require("fs");
const path = require("path");

const Economy = require("../models/Economy");

const BACKUP_FOLDER = path.join(__dirname, "backups");

if (!fs.existsSync(BACKUP_FOLDER)) {
    fs.mkdirSync(BACKUP_FOLDER, { recursive: true });
}


let backupSlot = 1;


async function createBackup(slot) {

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
            `backup-${slot}.json`
        );


        fs.writeFileSync(
            file,
            JSON.stringify(backup, null, 2)
        );


        console.log(
            `[Backup] Updated backup-${slot}.json (${users.length} profiles).`
        );


    } catch (err) {

        console.error(
            "[Backup] Failed to create backup."
        );

        console.error(err);

    }

}


function startBackupScheduler() {

    console.log(
        "[Backup] Scheduler started."
    );


    // Create first backup immediately

    createBackup(backupSlot);



    // Backup every hour

    setInterval(() => {


        backupSlot++;


        if (backupSlot > 3) {

            backupSlot = 1;

        }


        createBackup(backupSlot);


    }, 60 * 60 * 1000);

}


module.exports = {
    createBackup,
    startBackupScheduler
};
