const { EmbedBuilder } = require("discord.js");
const config = require("../../config");

const {
    getProfile,
    formatMoney
} = require("../../utils/economy");

module.exports = {
    name: "balance",
    aliases: ["bal", "money", "cash"],

    async execute(client, message, args) {

        const user =
            message.mentions.users.first() ||
            message.author;

        const profile = await getProfile(
            message.guild.id,
            user.id
        );

        const wallet = profile.wallet;
        const bank = profile.bank;
        const total = wallet + bank;

        const embed = new EmbedBuilder()
            .setColor(config.embedColor)
            .setAuthor({
                name: `${user.username}'s Balance`,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(
                user.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
                [
                    `**Wallet**`,
                    `\`$${formatMoney(wallet)}\``,
                    `**Bank**`,
                    `\`$${formatMoney(bank)}\``,
                    `**Net Worth**`,
                    `\`$${formatMoney(total)}\``
                ].join("\n")
            )
            .setFooter({
                text: `Requested by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true
                })
            })
            .setTimestamp();

        return message.reply({
            embeds: [embed]
        });
    }
};
