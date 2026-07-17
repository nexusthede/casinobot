const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

const {
    getProfile,
    formatMoney
} = require("../../utils/economy");

const MIN_REWARD = 500;
const MAX_REWARD = 1500;
const COOLDOWN = 24 * 60 * 60 * 1000;

module.exports = {
    name: "daily",
    aliases: ["claim"],

    async execute(client, message) {

        const profile = await getProfile(
            message.guild.id,
            message.author.id
        );

        if (profile.dailyCooldown) {
            const remaining =
                COOLDOWN - (Date.now() - profile.dailyCooldown.getTime());

            if (remaining > 0) {
                const hours = Math.floor(remaining / 3600000);
                const minutes = Math.floor((remaining % 3600000) / 60000);

                const embed = new EmbedBuilder()
                    .setColor(config.embedColor)
                    .setDescription(
                        `You have already claimed your daily reward.\n\nCome back in **${hours}h ${minutes}m**.`
                    );

                return message.reply({
                    embeds: [embed]
                });
            }
        }

        const reward =
            Math.floor(Math.random() * (MAX_REWARD - MIN_REWARD + 1)) +
            MIN_REWARD;

        profile.wallet += reward;
        profile.totalEarned += reward;
        profile.dailyCooldown = new Date();

        await profile.save();

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({
                name: "Daily Reward",
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setDescription(
                [
                    `You claimed **$${formatMoney(reward)}**.`,
                    "",
                    `**Wallet:** \`$${formatMoney(profile.wallet)}\``
                ].join("\n")
            )
            .setFooter({
                text: "Come back in 24 hours!"
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};
