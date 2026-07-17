const fs = require("fs");
const path = require("path");

const Economy = require("../models/Economy");

const BACKUP_FOLDER = path.join(__dirname, "backups");


async function restoreLatestBackup() {

    try {

        if (!fs.existsSync(BACKUP_FOLDER)) {

            console.log(
                "[Restore] Backup folder does not exist."
            );

            return false;
        }


        const backups = fs.readdirSync(BACKUP_FOLDER)
            .filter(file =>
                file === "backup-1.json" ||
                file === "backup-2.json" ||
                file === "backup-3.json"
            );


        if (!backups.length) {

            console.log(
                "[Restore] No backups found."
            );

            return false;
        }



        let latestBackup = null;
        let latestFile = null;



        for (const file of backups) {

            const filePath = path.join(
                BACKUP_FOLDER,
                file
            );


            try {

                const data = JSON.parse(
                    fs.readFileSync(
                        filePath,
                        "utf8"
                    )
                );


                if (
                    !data.createdAt ||
                    !data.data
                ) {
                    continue;
                }


                if (
                    !latestBackup ||
                    new Date(data.createdAt) >
                    new Date(latestBackup.createdAt)
                ) {

                    latestBackup = data;
                    latestFile = file;

                }


            } catch {}

        }



        if (!latestBackup) {

            console.log(
                "[Restore] No valid backups found."
            );

            return false;
        }



        let restored = 0;



        for (const profile of latestBackup.data) {


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
            `[Restore] Successfully restored ${restored} economy profiles from ${latestFile}.`
        );


        return true;



    } catch (err) {


        console.error(
            "[Restore] Failed to restore backup."
        );

        console.error(err);


        return false;

    }

}


module.exports = {
    restoreLatestBackup
};
