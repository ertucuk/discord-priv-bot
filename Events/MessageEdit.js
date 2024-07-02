const { Events, EmbedBuilder } = require("discord.js");
const { messageLog } = require('../System');

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
    if (oldMessage.author.bot || !oldMessage.guild || newMessage.channel.type != 0) return;
    if (oldMessage.content == newMessage.content) return;
    if (oldMessage.content.length > 1024 || newMessage.content.length > 1024) return;

    const embed = new EmbedBuilder({
        footer: { text: oldMessage.guild.name + ' | ' + `Created By Ertu`, iconURL: oldMessage.guild.iconURL({ dynamic: true, size: 2048 }) },
        timestamp: Date.now(),
        description: `${oldMessage.author} tarafından ${oldMessage.channel} kanalında bir mesaj düzenlendi!\n\nEski Mesaj İçeriği:\`\`\`fix\n${oldMessage.content}\n\`\`\`\nYeni Mesaj İçeriği:\`\`\`fix\n${newMessage.content}\n\`\`\``,
        fields: [
            { name: 'Kanal', value: `${oldMessage.channel}\n(\`${oldMessage.channel.id}\`)`, inline: true },
            { name: 'Düzenleyen', value: `${oldMessage.author}\n(\`${oldMessage.author.id}\`)`, inline: true },
            { name: 'Tarih', value: `${new Date().toLocaleString()}`, inline: true }
        ]
    });

    oldMessage.guild.channels.cache.get(messageLog).send({ embeds: [embed] });
})