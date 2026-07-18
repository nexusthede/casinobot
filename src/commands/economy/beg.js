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

    name: "beg",

    aliases: [
        "beggar"
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


        const cooldown =
            30 * 1000; // 30 seconds


        if (
            profile.begCooldown &&
            Date.now() - profile.begCooldown.getTime() < cooldown
        ) {

            const remaining =
                cooldown -
                (Date.now() - profile.begCooldown.getTime());

            const seconds =
                Math.ceil(remaining / 1000);

            return message.reply(
                `You have already begged recently. Try again in **${seconds} second(s)**.`
            );

        }


        const messages = [

            "A stranger felt generous and gave you",

            "Someone walking by donated",

            "You found a kind person who gave you",

            "A tourist handed you",

            "Someone at the bus stop gave you",

            "A friendly neighbor donated",

            "A businessman tipped you",

            "A generous person gave you"

        ];


        const text =
            messages[
                Math.floor(
                    Math.random() * messages.length
                )
            ];


        const amount =
            Math.floor(
                Math.random() * 651
            ) + 100; // $100 - $750


        profile.wallet += amount;
        profile.totalEarned += amount;
        profile.begCooldown = new Date();

        profile.transactions.push({
            type: "beg",
            amount
        });


        await saveProfile(
            profile
        );


        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("Beg")

            .setDescription(
`${text} **$${formatMoney(amount)}**.

**Wallet**
\`$${formatMoney(profile.wallet)}\``
            )

            .setTimestamp();


        return message.reply({
            embeds: [
                embed
            ]
        });


    }

};
