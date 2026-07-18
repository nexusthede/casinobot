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

const redNumbers = [
    1, 3, 5, 7, 9,
    12, 14, 16, 18,
    19, 21, 23, 25,
    27, 30, 32, 34, 36
];

module.exports = {

    name: "roulette",

    aliases: [
        "rl"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const betType =
            args[0]?.toLowerCase();

        const bet =
            Number(
                args[1]?.replace(/,/g, "")
            );


        if (
            !betType ||
            !bet
        ) {

            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Roulette")

                .setDescription(
`Bet on red, black, odd, even or a number.

**Syntax**
\`${config.prefix}roulette <bet> <amount>\`
**Examples**
\`${config.prefix}roulette red 500\`
\`${config.prefix}roulette black 500\`
\`${config.prefix}roulette odd 500\`
\`${config.prefix}roulette even 500\`
\`${config.prefix}roulette 17 500\``
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
                "roulette"
            );

        if (!placed.success) {

            return message.reply(
                placed.message
            );

        }


        const number =
            Math.floor(
                Math.random() * 37
            );

        let color = "green";

        if (number !== 0) {

            color =
                redNumbers.includes(number)
                    ? "red"
                    : "black";

        }

        const odd =
            number !== 0 &&
            number % 2 === 1;

        const even =
            number !== 0 &&
            number % 2 === 0;
        let won = false;
        let payout = 0;


        if (
            betType === "red"
        ) {

            won =
                color === "red";

            payout =
                bet * 2;

        }

        else if (
            betType === "black"
        ) {

            won =
                color === "black";

            payout =
                bet * 2;

        }

        else if (
            betType === "odd"
        ) {

            won =
                odd;

            payout =
                bet * 2;

        }

        else if (
            betType === "even"
        ) {

            won =
                even;

            payout =
                bet * 2;

        }

        else {

            const chosen =
                Number(betType);

            if (
                isNaN(chosen) ||
                chosen < 0 ||
                chosen > 36
            ) {

                return message.reply(
                    "Choose **red**, **black**, **odd**, **even**, or a number from **0-36**."
                );

            }

            won =
                chosen === number;

            payout =
                bet * 36;

        }


        if (won) {


            await winGame(
                message.guild.id,
                message.author.id,
                payout
            );


            const embed =
                new EmbedBuilder()

                .setColor("Green")

                .setTitle("Roulette Result")

                .setDescription(
`The ball landed on **${number} (${color})**.

You won **$${payout.toLocaleString()}**.`
                );


            return message.reply({
                embeds: [
                    embed
                ]
            });

        }
        else {


            await loseGame(
                message.guild.id,
                message.author.id,
                bet
            );


            const embed =
                new EmbedBuilder()

                .setColor("Red")

                .setTitle("Roulette Result")

                .setDescription(
`The ball landed on **${number} (${color})**.

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
