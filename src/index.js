require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials,
    ActivityType
} = require("discord.js");

const config = require("../config");

const app = express();

app.get("/", (req, res) => {
    res.send("Casino Bot Online");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Web server running on ${PORT}`);
});

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

const commandFolders = fs.readdirSync(
    path.join(__dirname, "commands")
);

for (const folder of commandFolders) {

    const commandFiles = fs
        .readdirSync(path.join(__dirname, "commands", folder))
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(path.join(__dirname, "commands", folder, file));

        client.commands.set(command.name.toLowerCase(), command);

        if (command.aliases) {
            for (const alias of command.aliases) {
                client.commands.set(alias.toLowerCase(), command);
            }
        }
    }
}

client.once("ready", async () => {

    console.log(`${client.user.tag} is online.`);

    client.user.setPresence({
        status: "online",
        activities: [
            {
                name: `${config.prefix}help`,
                type: ActivityType.Listening
            }
        ]
    });

    try {
        await mongoose.connect(config.mongoURI);
        console.log("Connected to MongoDB.");
    } catch (err) {
        console.error(err);
    }

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/\s+/);

    const commandName = args.shift()?.toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {

        await command.execute(client, message, args);

    } catch (err) {

        console.error(err);

        message.reply("An error occurred while running that command.");

    }

});

client.login(config.token);
