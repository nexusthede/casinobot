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

    name: "withdraw",

    aliases: [
        "with",
        "wd"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const profile =
            await getProfile(
                message.guild.id,
                message.author.id
            );


        let amount =
            args[0]
                ? Number(args[0].replace(/,/g, ""))
                : profile.bank;



        if (
            profile.bank <= 0
        ) {

            return message.reply(
                "You don't have any money in your bank."
            );

        }



        if (
            !amount ||
            amount <= 0 ||
            isNaN(amount)
        ) {

            return message.reply(
                "Please enter a valid amount."
            );

        }



        if (
            amount > profile.bank
        ) {

            return message.reply(
                "You don't have enough money in your bank."
            );

        }



        profile.bank -= amount;

        profile.wallet += amount;



        await saveProfile(
            profile
        );



        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("Withdraw")

            .setDescription(
`You withdrew **$${formatMoney(amount)}** from your bank.

**Wallet**
\`$${formatMoney(profile.wallet)}\`
**Bank**
\`$${formatMoney(profile.bank)}\``
            )

            .setTimestamp();



        return message.reply({
            embeds: [
                embed
            ]
        });


    }

};
