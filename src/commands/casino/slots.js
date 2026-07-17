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

    name: "slots",

    aliases: [
        "slot"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const bet =
            Number(args[0]);



        if (!bet) {


            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Slots")

                .setDescription(
`Spin the slots and try your luck.

**Syntax**
\`${config.prefix}slots <amount>\`

**Example**
\`${config.prefix}slot 500\``
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
                "slots"
            );



        if (!placed.success) {

            return message.reply(
                placed.message
            );

        }



        const symbols = [
            "🍒",
            "🍋",
            "🍊",
            "🍉",
            "⭐",
            "💎"
        ];



        const spin = [

            symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
            ],

            symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
            ],

            symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
            ]

        ];



        let multiplier = 0;



        if (
            spin[0] === spin[1] &&
            spin[1] === spin[2]
        ) {


            if (spin[0] === "💎") {

                multiplier = 10;

            } else if (spin[0] === "⭐") {

                multiplier = 5;

            } else {

                multiplier = 3;

            }


        } else if (

            spin[0] === spin[1] ||
            spin[1] === spin[2] ||
            spin[0] === spin[2]

        ) {

            multiplier = 2;

        }



        const won =
            multiplier > 0;



        if (won) {


            const payout =
                bet * multiplier;



            await winGame(
                message.guild.id,
                message.author.id,
                payout
            );



            const embed =
                new EmbedBuilder()

                .setColor("Green")

                .setTitle("Slots Result")

                .setDescription(
`**${spin.join(" | ")}**

You won **$${payout.toLocaleString()}**.`
                )

                .setFooter({
                    text:
                    `Played by ${message.author.username}`
                });



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

                .setTitle("Slots Result")

                .setDescription(
`**${spin.join(" | ")}**

You lost **$${bet.toLocaleString()}**.`
                )

                .setFooter({
                    text:
                    `Played by ${message.author.username}`
                });



            return message.reply({
                embeds: [
                    embed
                ]
            });


        }


    }

};
