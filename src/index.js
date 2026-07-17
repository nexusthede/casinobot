require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials
} = require("discord.js");

const { DefaultWebSocketManagerOptions } = require("@discordjs/ws");

DefaultWebSocketManagerOptions.identifyProperties.browser = "Discord Android";

const config = require("../config");

const ALLOWED_GUILD_ID = "1406596836793516102";

// =========================
// EXPRESS
// =========================

const app = express();

app.get("/", (req, res) => {
    res.send("Casino Bot Online");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Web server running on port ${PORT}`);
});

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
// LOAD COMMANDS
// =========================

const commandsPath = path.join(__dirname, "commands");

for (const folder of fs.readdirSync(commandsPath)) {

    const folderPath = path.join(commandsPath, folder);

    const commandFiles = fs
        .readdirSync(folderPath)
        .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {

        const command = require(path.join(folderPath, file));

        client.commands.set(command.name.toLowerCase(), command);

        if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
                client.commands.set(alias.toLowerCase(), command);
            }
        }
    }
}

// =========================
// READY
// =========================

client.once("ready", async () => {

    console.log(`${client.user.tag} is online.`);

    for (const guild of client.guilds.cache.values()) {

        if (guild.id !== ALLOWED_GUILD_ID) {

            console.log(`Leaving ${guild.name} (${guild.id})`);

            await guild.leave().catch(() => {});
        }
    }

});

// =========================
// AUTO LEAVE NEW GUILDS
// =========================

client.on("guildCreate", async guild => {

    if (guild.id !== ALLOWED_GUILD_ID) {
        await guild.leave().catch(() => {});
    }

});

// =========================
// MESSAGE HANDLER
// =========================

client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.guild.id !== ALLOWED_GUILD_ID) return;

    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/\s+/);

    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = client.commands.get(commandName);

    if (!command) return;

    try {

        await command.execute(client, message, args);

    } catch (err) {

        console.error(err);

        message.reply("An error occurred while running that command.");

    }

});

// =========================
// START
// =========================

(async () => {

    try {

        await mongoose.connect(config.mongoURI);

        console.log("Connected to MongoDB.");

        await client.login(config.token);

    } catch (err) {

        console.error(err);

    }

})();
