require("dotenv").config();

const express = require("express");
const path = require("path");

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require("discord.js");

const { DefaultWebSocketManagerOptions } = require("@discordjs/ws");

DefaultWebSocketManagerOptions.identifyProperties.browser = "Discord Android";

const config = require("../config");

const database = require("./recovery/database");
const { startAutoSave } = require("./recovery/autosave");
const { restoreLatestBackup } = require("./recovery/restore");

const loadCommands = require("./loaders/commandLoader");

const setupMessages = require("./handlers/messages");
const setupGuilds = require("./handlers/guilds");
const setupErrors = require("./handlers/errors");

const ALLOWED_GUILD_ID = "1406596836793516102";


// =========================
// EXPRESS
// =========================

const app = express();

app.get("/", (req, res) => {
    res.send("Casino Bot Online");
});

app.listen(
    process.env.PORT || 3000,
    () => console.log("Web server online")
);


// =========================
// CLIENT
// =========================

const client = new Client({

    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],

    partials: [
        Partials.Channel
    ]

});


client.commands = new Collection();


// =========================
// STARTUP
// =========================

(async () => {

    try {

        await database.connect(config.mongoURI);

        await restoreLatestBackup();

        loadCommands(client);


        setupMessages(
            client,
            config,
            ALLOWED_GUILD_ID
        );


        setupGuilds(
            client,
            ALLOWED_GUILD_ID
        );


        setupErrors();


        startAutoSave();


        await client.login(config.token);


    } catch (err) {

        console.error(err);

    }

})();


// =========================
// READY
// =========================

client.once("ready", async () => {

    console.log(
        `${client.user.tag} online`
    );


    for (const guild of client.guilds.cache.values()) {

        if (guild.id !== ALLOWED_GUILD_ID) {

            await guild.leave();

        }

    }

});
