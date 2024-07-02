const { PermissionsBitField } = require('discord.js');
const system = require('../../System');

module.exports = {
    name: "vip",
    aliases: [],

    execute: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send({ content: 'Bir kullanıcı belirtmelisin.' });
        if (member.id === message.author.id) return message.channel.send({ content: 'Kendine vip veremezsin.' });
        
        if (member.roles.cache.has(system.vipRole)) {
            member.roles.remove(system.vipRole);
            message.channel.send({ content: `${member} adlı kullanıcıdan vip rolü alındı!` });
        } else {
            member.roles.add(system.vipRole);
            message.channel.send({ content: `${member} adlı kullanıcıya vip rolü verildi!` });
        }
    }
}