const {
    EmbedBuilder
} = require("discord.js");

const config = require("../../config");

const {
    validateBet,
    placeBet,
    winGame,
    loseGame
} = require("../../utils/casino");


module.exports = {

    name: "coinflip",

    aliases: [
        "cf"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const choice =
            args[0]?.toLowerCase();


        const bet =
            Number(args[1]?.replace(/,/g, ""));



        if (
            !choice ||
            !["heads", "tails"].includes(choice) ||
            !bet
        ) {

            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Coinflip")

                .setDescription(
`Flip a coin and double your bet.

**Syntax**
\`${config.prefix}coinflip <heads/tails> <amount>\`

**Example**
\`${config.prefix}cf heads 500\``
                );


            return message.reply({
                embeds: [
                    embed
                ]
            });

        }



        const check =
            validateBet(bet);


        if (!check.valid) {

            return message.reply(
                check.message
            );

        }



        const placed =
            await placeBet(
                message.guild.id,
                message.author.id,
                bet,
                "coinflip"
            );



        if (!placed.success) {

            return message.reply(
                placed.message
            );

        }



        const result =
            Math.random() < 0.5
                ? "heads"
                : "tails";



        const won =
            result === choice;



        if (won) {


            const payout =
                bet * 2;



            await winGame(
                message.guild.id,
                message.author.id,
                payout
            );



            const embed =
                new EmbedBuilder()

                .setColor("Green")

                .setTitle("Coinflip Result")

                .setDescription(
`The coin landed on **${result}**.

You won **$${payout.toLocaleString()}**.`
                );



            return message.reply({
                embeds: [
                    embed
                ]
            });


        } else {


            await loseGame(
                message.guild.id,
                message.author.id,
                bet
            );



            const embed =
                new EmbedBuilder()

                .setColor("Red")

                .setTitle("Coinflip Result")

                .setDescription(
`The coin landed on **${result}**.

You lost **$${bet.toLocaleString()}**.`
                );



            return message.reply({
                embeds: [
                    embed
                ]
            });


        }


    }

};
