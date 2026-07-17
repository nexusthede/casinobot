const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

const {
    getProfile,
    saveProfile,
    formatMoney
} = require("../../utils/economy");


module.exports = {

    name: "slots",

    aliases: [
        "slot"
    ],


    async execute(client, message, args) {


        const amount = Number(args[0]);


        if (!amount || amount <= 0) {

            return message.reply(
                "Please enter a valid amount."
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



        const symbols = [
            "🍒",
            "🍋",
            "🍊",
            "🍉",
            "⭐",
            "💎"
        ];



        const spin = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
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

        } 
        
        else if (
            spin[0] === spin[1] ||
            spin[1] === spin[2] ||
            spin[0] === spin[2]
        ) {

            multiplier = 2;

        }



        let winnings = 0;


        if (multiplier > 0) {

            winnings = amount * multiplier;

            profile.wallet += winnings;

        } 
        
        else {

            profile.wallet -= amount;

        }



        await saveProfile(profile);



        const embed = new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("🎰 Slots")

            .setDescription(

                [
                    `**${spin.join(" | ")}**`,
                    "",
                    multiplier > 0
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
