const { createBackup } = require("./backup");

let shutdown = false;

let backupSlot = 1;


/**
 * Starts automatic background tasks.
 */
function startAutoSave() {

    console.log("[AutoSave] Started.");


    // Create first backup immediately
    createBackup(backupSlot);


    // Create a backup every hour
    setInterval(async () => {

        try {

            backupSlot++;


            if (backupSlot > 3) {
                backupSlot = 1;
            }


            await createBackup(backupSlot);


            console.log(
                `[AutoSave] backup-${backupSlot}.json completed.`
            );


        } catch (err) {

            console.error(
                "[AutoSave] Backup failed."
            );

            console.error(err);

        }

    }, 60 * 60 * 1000);



    // Memory cleanup log every 10 minutes
    setInterval(() => {

        const memory = process.memoryUsage();

        console.log(
            `[Memory] RSS: ${Math.round(memory.rss / 1024 / 1024)} MB | Heap: ${Math.round(memory.heapUsed / 1024 / 1024)} MB`
        );

    }, 10 * 60 * 1000);

}



/**
 * Runs before the bot shuts down.
 */
async function gracefulShutdown(client) {

    if (shutdown) return;


    shutdown = true;


    console.log(
        "[System] Saving before shutdown..."
    );


    try {

        await createBackup(backupSlot);


        console.log(
            `[System] backup-${backupSlot}.json completed.`
        );


    } catch (err) {

        console.error(
            "[System] Backup failed."
        );

        console.error(err);

    }



    try {

        if (client) {

            await client.destroy();

            console.log(
                "[Discord] Client disconnected."
            );

        }


    } catch (err) {

        console.error(err);

    }


    process.exit(0);

}



// CTRL + C
process.on(
    "SIGINT",
    () => gracefulShutdown()
);


// Render / Linux shutdown
process.on(
    "SIGTERM",
    () => gracefulShutdown()
);


// Unhandled promise rejection
process.on(
    "unhandledRejection",
    err => {

        console.error(
            "[UnhandledRejection]"
        );

        console.error(err);

    }
);


// Uncaught exception
process.on(
    "uncaughtException",
    err => {

        console.error(
            "[UncaughtException]"
        );

        console.error(err);

    }
);


module.exports = {
    startAutoSave,
    gracefulShutdown
};
