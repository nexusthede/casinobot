const logger = require("../recovery/logger");

module.exports = function setupGuilds(
    client,
    ALLOWED_GUILD_ID
) {


    // When bot joins a server
    client.on("guildCreate", async guild => {

        try {

            if (guild.id !== ALLOWED_GUILD_ID) {

                logger.guildJoin(guild);

                console.log(
                    `[Security] Leaving unauthorized guild: ${guild.name}`
                );


                await guild.leave();


                return;

            }


            logger.guildJoin(guild);


            console.log(
                `[Security] Allowed guild connected: ${guild.name}`
            );


        } catch (err) {

            logger.error(
                `Guild Create Error: ${err.stack || err}`
            );

        }

    });



    // When bot leaves a server
    client.on("guildDelete", guild => {

        try {

            logger.guildLeave(guild);


            console.log(
                `[Security] Left guild: ${guild.name}`
            );


        } catch (err) {

            logger.error(
                `Guild Delete Error: ${err.stack || err}`
            );

        }

    });


};
