const { Events, EmbedBuilder } = require("discord.js");
const { messageLog } = require('../System');

client.on(Events.MessageDelete, async (message) => {
    if (message.author.bot || !message.guild || message.content == null) return;

    const embed = new EmbedBuilder({
        footer: { text: message.guild.name + ' | ' + `Created By Ertu`, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) },
        timestamp: Date.now(),
        description: `${message.author} tarafından ${message.channel} kanalında bir mesaj silindi!\nMesaj İçeriği:\`\`\`fix\n${message.content.length > 1024 ? `${message.content.slice(0, 1021)}...` : message.content}\n\`\`\``,
        fields: [
            { name: 'Kanal', value: `${message.channel}\n(\`${message.channel.id}\`)`, inline: true },
            { name: 'Silen', value: `${message.author}\n(\`${message.author.id}\`)`, inline: true },
            { name: 'Tarih', value: `${new Date().toLocaleString()}`, inline: true }
        ]
    })

    const logChannel = message.guild.channels.cache.get(messageLog);
    if (!message.attachments.first()) logChannel.send({ embeds: [embed] });

    if (message.attachments.first()) {
        const embed = new EmbedBuilder({
            footer: { text: message.guild.name + ' | ' + `Created By Ertu`, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) },
            timestamp: Date.now(),
            image: { url: message.attachments.first().proxyURL },
            description: `${message.author} tarafından ${message.channel} kanalında bir içerik (dosya) silindi!`,
            fields: [
                { name: 'Kanal', value: `${message.channel}\n(\`${message.channel.id}\`)`, inline: true },
                { name: 'Silen', value: `${message.author}\n(\`${message.author.id}\`)`, inline: true },
                { name: 'Tarih', value: `${new Date().toLocaleString()}`, inline: true }
            ]
        })

        logChannel.send({ embeds: [embed] });
    }
})