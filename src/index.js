require("dotenv").config();

const express = require("express");

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ActivityType
} = require("discord.js");

const {
    DefaultWebSocketManagerOptions
} = require("@discordjs/ws");

DefaultWebSocketManagerOptions.identifyProperties.browser =
    "Discord Android";


const config = require("./config");

const database = require("./recovery/database");

const {
    restoreLatestBackup
} = require("./recovery/restore");

const {
    startAutoSave,
    gracefulShutdown
} = require("./recovery/autosave");


const loadCommands = require("./loaders/commandLoader");

const setupMessages = require("./handlers/messages");
const setupGuilds = require("./handlers/guilds");
const setupErrors = require("./handlers/errors");


const ALLOWED_GUILD_ID =
    "1406596836793516102";


// =========================
// EXPRESS
// =========================

const app = express();


app.get("/", (req, res) => {
    res.send("Casino Bot Online");
});


const PORT =
    process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Web server running on ${PORT}`
    );

});



// =========================
// DISCORD CLIENT
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


client.commands =
    new Collection();



// =========================
// READY
// =========================

client.once(
    "ready",
    async () => {


        console.log(
            `${client.user.tag} is online`
        );


        // =========================
        // STATUS
        // =========================

        const statuses = [
            "mmmm come try your luck with me",
            `🔗 discord.gg/${client.guilds.cache.first().name}`
        ];


        let statusIndex = 0;


        client.user.setActivity(
            statuses[statusIndex],
            {
                type: ActivityType.Playing
            }
        );


        setInterval(() => {

            statusIndex++;


            if (statusIndex >= statuses.length) {

                statusIndex = 0;

            }


            client.user.setActivity(
                statuses[statusIndex],
                {
                    type: ActivityType.Playing
                }
            );


        }, 15000);



        // Remove unauthorized servers

        for (
            const guild of client.guilds.cache.values()
        ) {


            if (
                guild.id !== ALLOWED_GUILD_ID
            ) {

                console.log(
                    `Leaving unauthorized server: ${guild.name}`
                );


                await guild.leave()
                    .catch(() => {});

            }

        }


    }
);



// =========================
// START BOT
// =========================

(async () => {

    try {


        await database.connect(
            config.mongoURI
        );


        console.log(
            "Database connected"
        );



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



        await client.login(
            config.token
        );



    } catch (err) {


        console.error(
            "Startup failed:"
        );


        console.error(err);


        process.exit(1);


    }


})();



// =========================
// GRACEFUL SHUTDOWN
// =========================

process.on(
    "SIGINT",
    () => gracefulShutdown(client)
);


process.on(
    "SIGTERM",
    () => gracefulShutdown(client)
);
