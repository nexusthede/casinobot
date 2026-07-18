const {
    EmbedBuilder
} = require("discord.js");

const config = require("../../config");

const Economy = require("../../models/Economy");

const {
    formatMoney
} = require("../../utils/economy");


module.exports = {

    name: "leaderboard",

    aliases: [
        "lb",
        "rich"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const users =
            await Economy.find({
                guildId: message.guild.id
            })
            .sort({
                wallet: -1,
                bank: -1
            })
            .limit(10);



        if (!users.length) {

            return message.reply(
                "No economy data found."
            );

        }



        let leaderboard = "";



        for (
            let i = 0;
            i < users.length;
            i++
        ) {


            const user =
                await client.users.fetch(
                    users[i].userId
                )
                .catch(() => null);



            const name =
                user
                    ? user.username
                    : "Unknown User";



            const total =
                users[i].wallet +
                users[i].bank;



            leaderboard +=
`> **${i + 1}.** ${name}
> \`$${formatMoney(total)}\`
`;

        }



        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setAuthor({

                name: message.guild.name,

                iconURL: message.guild.iconURL({
                    dynamic: true
                })

            })

            .setThumbnail(
                message.guild.iconURL({
                    dynamic: true
                })
            )

            .setTitle("Top Richest")

            .setDescription(
                leaderboard
            )

            .setTimestamp();



        return message.reply({

            embeds: [
                embed
            ]

        });


    }

};
