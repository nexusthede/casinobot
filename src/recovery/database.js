const mongoose = require("mongoose");

let reconnecting = false;

async function connect(uri) {
    try {
        await mongoose.connect(uri);

        console.log("[MongoDB] Connected");
    } catch (err) {
        console.error("[MongoDB] Initial connection failed.");
        console.error(err);

        reconnect(uri);
    }
}

async function reconnect(uri) {

    if (reconnecting) return;

    reconnecting = true;

    const retry = async () => {

        try {

            console.log("[MongoDB] Attempting to reconnect...");

            await mongoose.connect(uri);

            reconnecting = false;

            console.log("[MongoDB] Successfully reconnected.");

        } catch (err) {

            console.log("[MongoDB] Reconnect failed. Retrying in 5 seconds...");

            setTimeout(retry, 5000);

        }

    };

    retry();
}

mongoose.connection.on("connected", () => {
    console.log("[MongoDB] Connection established.");
});

mongoose.connection.on("disconnected", () => {
    console.log("[MongoDB] Connection lost.");
});

mongoose.connection.on("error", err => {
    console.error("[MongoDB] Error:");
    console.error(err);
});

module.exports = {
    connect
};
