const logger = require("../recovery/logger");

module.exports = function setupMessages(
    client,
    config,
    ALLOWED_GUILD_ID
) {

    client.on("messageCreate", async message => {

        try {

            if (message.author.bot) return;

            if (!message.guild) return;


            // Server lock
            if (message.guild.id !== ALLOWED_GUILD_ID) {
                return;
            }


            // Prefix check
            if (!message.content.startsWith(config.prefix)) {
                return;
            }


            const args = message.content
                .slice(config.prefix.length)
                .trim()
                .split(/\s+/);


            const commandName = args
                .shift()
                ?.toLowerCase();


            if (!commandName) return;


            const command = client.commands.get(
                commandName
            );


            if (!command) return;


            logger.command(
                message,
                commandName
            );


            await command.execute(
                client,
                message,
                args
            );


        } catch (err) {

            logger.error(
                `Command Error: ${err.stack || err}`
            );


            console.error(err);


            try {

                await message.reply(
                    "An error occurred while running this command."
                );

            } catch {}

        }

    });

};
