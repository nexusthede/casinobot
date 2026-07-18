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

    name: "work",

    aliases: [
        "job"
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
            60 * 60 * 1000; // 1 hour


        if (
            profile.workCooldown &&
            Date.now() - profile.workCooldown.getTime() < cooldown
        ) {

            const remaining =
                cooldown -
                (Date.now() - profile.workCooldown.getTime());

            const minutes =
                Math.ceil(remaining / 60000);

            return message.reply(
                `You have already worked recently. Try again in **${minutes} minute(s)**.`
            );

        }


        const jobs = [
            "Programmer",
            "Cashier",
            "Mechanic",
            "Chef",
            "Taxi Driver",
            "Police Officer",
            "Firefighter",
            "Construction Worker",
            "Farmer",
            "Streamer"
        ];


        const job =
            jobs[
                Math.floor(
                    Math.random() * jobs.length
                )
            ];


        const amount =
            Math.floor(
                Math.random() * 4001
            ) + 1000; // $1,000 - $5,000


        profile.wallet += amount;
        profile.totalEarned += amount;
        profile.workCooldown = new Date();

        profile.transactions.push({
            type: "work",
            amount
        });


        await saveProfile(
            profile
        );


        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("Work")

            .setDescription(
`You worked as a **${job}** and earned **$${formatMoney(amount)}**.

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
