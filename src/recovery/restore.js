const fs = require("fs");
const path = require("path");

const Economy = require("../models/Economy");

const BACKUP_FOLDER = path.join(__dirname, "..", "backups");

async function restoreLatestBackup() {

    try {

        if (!fs.existsSync(BACKUP_FOLDER)) {
            console.log("[Restore] Backup folder does not exist.");
            return false;
        }

        const backups = fs.readdirSync(BACKUP_FOLDER)
            .filter(file => file.endsWith(".json"))
            .sort();

        if (!backups.length) {
            console.log("[Restore] No backups found.");
            return false;
        }

        const latest = backups[backups.length - 1];

        const backupPath = path.join(
            BACKUP_FOLDER,
            latest
        );

        const backup = JSON.parse(
            fs.readFileSync(backupPath, "utf8")
        );

        if (!backup.data || !Array.isArray(backup.data)) {
            console.log("[Restore] Invalid backup.");
            return false;
        }

        let restored = 0;

        for (const profile of backup.data) {

            await Economy.findOneAndUpdate(
                {
                    guildId: profile.guildId,
                    userId: profile.userId
                },
                profile,
                {
                    upsert: true,
                    new: true,
                    overwrite: true
                }
            );

            restored++;
        }

        console.log(
            `[Restore] Successfully restored ${restored} economy profiles from ${latest}.`
        );

        return true;

    } catch (err) {

        console.error("[Restore] Failed to restore backup.");
        console.error(err);

        return false;
    }
}

module.exports = {
    restoreLatestBackup
};
