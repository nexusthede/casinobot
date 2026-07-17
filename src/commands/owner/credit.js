const {
    EmbedBuilder
} = require("discord.js");

const config = require("../../config");

const {
    getProfile,
    formatMoney
} = require("../../utils/economy");


const OWNER_ID =
    "1399876210263068682";


module.exports = {

    name: "credit",

    aliases: [
        "addcash"
    ],


    async execute(
        client,
        message,
        args
    ) {


        if (
            message.author.id !== OWNER_ID
        ) {

            return message.reply(
                "You don't have access to this command."
            );

        }



        const user =
            message.mentions.users.first();



        const amount =
            Number(args[1]);



        if (
            !user ||
            !amount ||
            amount <= 0
        ) {


            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Credit")

                .setDescription(
`Add money to a user's wallet.

**Syntax**
\`${config.prefix}credit <user> <amount>\`

**Example**
\`${config.prefix}credit @user 5000\``
                );


            return message.reply({
                embeds: [
                    embed
                ]
            });

        }



        const profile =
            await getProfile(
                message.guild.id,
                user.id
            );



        profile.wallet += amount;



        await profile.save();



        const embed =
            new EmbedBuilder()

            .setColor("Green")

            .setTitle("Money Credited")

            .setDescription(
`${user} received **$${formatMoney(amount)}**.

New wallet balance:
**$${formatMoney(profile.wallet)}**`
            )

            .setFooter({
                text:
                `Credited by ${message.author.username}`
            });



        return message.reply({
            embeds: [
                embed
            ]
        });


    }

};
