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

    name: "dice",

    aliases: [
        "roll"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const guess =
            Number(args[0]);


        const bet =
            Number(args[1]?.replace(/,/g, ""));



        if (
            !guess ||
            guess < 1 ||
            guess > 6 ||
            !bet
        ) {


            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Dice")

                .setDescription(
`Roll a dice and win if your guess is correct.

**Syntax**
\`${config.prefix}dice <number 1-6> <amount>\`
**Example**
\`${config.prefix}roll 6 500\``
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
                "dice"
            );



        if (!placed.success) {

            return message.reply(
                placed.message
            );

        }



        const roll =
            Math.floor(Math.random() * 6) + 1;



        const won =
            roll === guess;



        if (won) {


            const payout =
                bet * 5;



            await winGame(
                message.guild.id,
                message.author.id,
                payout
            );



            const embed =
                new EmbedBuilder()

                .setColor("Green")

                .setTitle("Dice Result")

                .setDescription(
`The dice rolled **${roll}**.

You guessed **${guess}**.

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

                .setTitle("Dice Result")

                .setDescription(
`The dice rolled **${roll}**.

You guessed **${guess}**.

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
