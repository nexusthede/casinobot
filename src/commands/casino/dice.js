const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

const {
    getProfile,
    saveProfile,
    formatMoney
} = require("../../utils/economy");


module.exports = {

    name: "dice",

    aliases: [
        "roll"
    ],


    async execute(client, message, args) {


        const amount = Number(args[0]);
        const guess = Number(args[1]);



        if (!amount || amount <= 0) {

            return message.reply(
                "Usage: ,dice <amount> <number 1-6>"
            );

        }



        if (
            !guess ||
            guess < 1 ||
            guess > 6
        ) {

            return message.reply(
                "Pick a number between 1 and 6."
            );

        }



        const profile = await getProfile(
            message.guild.id,
            message.author.id
        );



        if (profile.wallet < amount) {

            return message.reply(
                "You don't have enough money."
            );

        }



        const roll =
            Math.floor(Math.random() * 6) + 1;



        let winnings = 0;



        if (roll === guess) {

            winnings = amount * 5;

            profile.wallet += winnings;

        } else {

            profile.wallet -= amount;

        }



        await saveProfile(profile);



        const embed = new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("🎲 Dice")

            .setDescription(

                [

                    `You rolled: **${roll}**`,

                    `Your guess: **${guess}**`,

                    "",

                    roll === guess

                        ? `You won **$${formatMoney(winnings)}**`

                        : `You lost **$${formatMoney(amount)}**`,

                    "",

                    `Wallet: **$${formatMoney(profile.wallet)}**`

                ].join("\n")

            )

            .setFooter({

                text: `Played by ${message.author.username}`,

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
