const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, inlineCode } = require('discord.js');
const system = require('../../System');

module.exports = {
    name: "özeloda",
    aliases: ['ozeloda'],

    execute: async (client, message, args) => {

        if (!system.botOwners.some(owner => owner == message.author.id)) return;

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('lock')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔒'),
                new ButtonBuilder()
                    .setCustomId('unlock')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🔓'),
                new ButtonBuilder()
                    .setCustomId('add')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('➕'),
                new ButtonBuilder()
                    .setCustomId('remove')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('➖'),
                new ButtonBuilder()
                    .setCustomId('disconnect')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('❌'),
            );

        const embed = new EmbedBuilder({
            title: 'Oda Yönetim Paneli',
            description: [
                `Özel odanızı yönetmek için aşağıdaki butonları kullanabilirsiniz.\n`,
                `${inlineCode('Odayı Aç      :')} 🔓`,
                `${inlineCode('Odayı Kilitle :')} 🔒`,
                `${inlineCode('Odaya Ekle    :')} ➕`,
                `${inlineCode('Odadan Çıkar  :')} ➖`,
                `${inlineCode('Odadan At     :')} ❌`	
            ].join('\n'),
            footer: { text: 'made by ertu ❤️' }
        })

        message.channel.send({
            embeds: [embed],
            components: [buttonRow]
        });

    }
}