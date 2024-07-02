const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const system = require('../../System');
const count = require('../../Schema/Count');

module.exports = {
    name: "registerbuton",
    aliases: [],

    execute: async (client, message, args) => {

        if (!system.botOwners.some(owner => owner == message.author.id)) return;

        const labelCounter = await count.findOne({ guildID: message.guild.id })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('register')
                    .setLabel(`Kayıt Ol - ${labelCounter?.count || 0}`)
                    .setStyle(ButtonStyle.Secondary)
            );

        message.channel.send({ content: `Kayıt olmak için aşağıdaki butona tıkla!`, components: [row] });
    }
}