const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av'],

    execute: async (client, message, args) => {
        const member = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) || message.author;
        if (!member) return message.channel.send({ content: 'Bir kullanıcı belirtmelisin.' });

        message.channel.send({
            embeds: [
                new EmbedBuilder({
                    author: { name: `${member.username}`, iconURL: member.displayAvatarURL({ dynamic: true }) },
                    image: { url: member.displayAvatarURL({ dynamic: true, size: 4096 }) },
                })
            ]
        });
    }
}

