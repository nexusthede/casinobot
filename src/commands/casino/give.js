const {
    EmbedBuilder
} = require("discord.js");

const config = require("../../config");

const {
    getProfile,
    saveProfile,
    formatMoney
} = require("../../utils/economy");


module.exports = {

    name: "give",

    aliases: [
        "pay"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const user =
            message.mentions.users.first();


        const amount =
            Number(args[1]);



        if (
            !user ||
            !amount ||
            amount <= 0 ||
            isNaN(amount)
        ) {


            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Give")

                .setDescription(
`Give money to another user.

**Syntax**
\`${config.prefix}give <user> <amount>\`

**Example**
\`${config.prefix}give @user 500\``
                );


            return message.reply({
                embeds: [
                    embed
                ]
            });

        }



        if (
            user.id === message.author.id
        ) {

            return message.reply(
                "You cannot give money to yourself."
            );

        }



        const sender =
            await getProfile(
                message.guild.id,
                message.author.id
            );



        if (
            sender.wallet < amount
        ) {

            return message.reply(
                "You don't have enough money."
            );

        }



        const receiver =
            await getProfile(
                message.guild.id,
                user.id
            );



        sender.wallet -= amount;

        receiver.wallet += amount;



        await saveProfile(
            sender
        );


        await saveProfile(
            receiver
        );



        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setAuthor({
                name: `${message.author.username}'s Balance`,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true
                })
            })

            .setThumbnail(
                message.author.displayAvatarURL({
                    dynamic: true
                })
            )

            .setDescription(
                [
                    `**Sent**`,
                    `\`$${formatMoney(amount)}\``,
                    ``,
                    `**To**`,
                    `${user}`,
                    ``,
                    `**Wallet**`,
                    `\`$${formatMoney(sender.wallet)}\``
                ].join("\n")
            )

            .setFooter({
                text: `Payment sent by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true
                })
            })

            .setTimestamp();



        return message.reply({
            embeds: [
                embed
            ]
        });


    }

};
