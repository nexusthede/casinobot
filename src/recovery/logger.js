const fs = require("fs");
const path = require("path");

const LOG_FOLDER = path.join(__dirname, "..", "logs");

if (!fs.existsSync(LOG_FOLDER)) {
    fs.mkdirSync(LOG_FOLDER, { recursive: true });
}

function getLogFile() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return path.join(LOG_FOLDER, `${year}-${month}-${day}.log`);
}

function timestamp() {
    return new Date().toISOString();
}

function write(level, message) {

    const line = `[${timestamp()}] [${level}] ${message}\n`;

    fs.appendFile(
        getLogFile(),
        line,
        err => {
            if (err) console.error(err);
        }
    );

}

function info(message) {
    write("INFO", message);
}

function warn(message) {
    write("WARN", message);
}

function error(message) {
    write("ERROR", message);
}

function command(message, command) {

    write(
        "COMMAND",
        `${message.author.tag} (${message.author.id}) used "${command}" in #${message.channel.name}`
    );

}

function economy(user, action, amount) {

    write(
        "ECONOMY",
        `${user.tag} (${user.id}) ${action} $${amount.toLocaleString()}`
    );

}

function guildJoin(guild) {

    write(
        "GUILD",
        `Joined ${guild.name} (${guild.id})`
    );

}

function guildLeave(guild) {

    write(
        "GUILD",
        `Left ${guild.name} (${guild.id})`
    );

}

function backup(users) {

    write(
        "BACKUP",
        `Created backup containing ${users.toLocaleString()} profiles`
    );

}

module.exports = {
    info,
    warn,
    error,
    command,
    economy,
    guildJoin,
    guildLeave,
    backup
};
