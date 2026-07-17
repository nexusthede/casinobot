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

    name: "deposit",

    aliases: [
        "dep"
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
                : profile.wallet;



        if (
            profile.wallet <= 0
        ) {

            return message.reply(
                "You don't have any money to deposit."
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
            amount > profile.wallet
        ) {

            return message.reply(
                "You don't have enough money in your wallet."
            );

        }



        profile.wallet -= amount;

        profile.bank += amount;



        await saveProfile(
            profile
        );



        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("Deposit")

            .setDescription(
`You deposited **$${formatMoney(amount)}** into your bank.

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
