const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../../config");

const marriages = new Map();


module.exports = {

    name: "marry",

    aliases: [
        "proposal"
    ],


    async execute(
        client,
        message,
        args
    ) {


        const user =
            message.mentions.users.first();



        if (!user) {

            const embed =
                new EmbedBuilder()

                .setColor(config.embedColor)

                .setTitle("Marry")

                .setDescription(
`Propose to another user.

**Syntax**
\`${config.prefix}marry <user>\`
**Example**
\`${config.prefix}marry @user\``
                );


            return message.reply({
                embeds: [
                    embed
                ]
            });

        }



        if (
            user.id === message.author.id
        ) {

            return message.reply(
                "You cannot marry yourself."
            );

        }



        if (
            user.bot
        ) {

            return message.reply(
                "You cannot marry a bot."
            );

        }



        if (
            marriages.has(message.author.id)
        ) {

            return message.reply(
                "You are already married."
            );

        }



        if (
            marriages.has(user.id)
        ) {

            return message.reply(
                "That user is already married."
            );

        }



        const embed =
            new EmbedBuilder()

            .setColor(config.embedColor)

            .setTitle("Marriage Proposal")

            .setDescription(
`${message.author} wants to marry ${user}.

Do you accept?`
            )

            .setTimestamp();



        const row =
            new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                .setCustomId("accept_marriage")
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),


                new ButtonBuilder()
                .setCustomId("decline_marriage")
                .setLabel("Decline")
                .setStyle(ButtonStyle.Danger)

            );



        const msg =
            await message.reply({

                embeds: [
                    embed
                ],

                components: [
                    row
                ]

            });



        const collector =
            msg.createMessageComponentCollector({

                time: 60000

            });



        collector.on(
            "collect",
            async interaction => {


                if (
                    interaction.user.id !== user.id
                ) {

                    return interaction.reply({

                        content:
                        "Only the mentioned user can respond.",

                        ephemeral: true

                    });

                }



                if (
                    interaction.customId === "accept_marriage"
                ) {


                    marriages.set(
                        message.author.id,
                        user.id
                    );


                    marriages.set(
                        user.id,
                        message.author.id
                    );



                    const accepted =
                        new EmbedBuilder()

                        .setColor("Green")

                        .setTitle("Marriage Accepted")

                        .setDescription(
`Congratulations!

${message.author} and ${user} are now married.`
                        );



                    await interaction.update({

                        embeds: [
                            accepted
                        ],

                        components: []

                    });



                    collector.stop();



                } else {


                    const declined =
                        new EmbedBuilder()

                        .setColor("Red")

                        .setTitle("Marriage Declined")

                        .setDescription(
`${user} declined the proposal.`
                        );



                    await interaction.update({

                        embeds: [
                            declined
                        ],

                        components: []

                    });



                    collector.stop();

                }


            }
        );


    }

};
