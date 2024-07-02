const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: "say",
    aliases: [],

    execute: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return;

        const totalMember = message.guild.memberCount;
        const onlineMember = message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size
        const voiceMember = message.guild.members.cache.filter(m => m.voice.channel).size
      
        const embed = new EmbedBuilder({
            description: `Sunucumuzda toplam **${totalMember}** üye bulunmakta. Bunlardan **${onlineMember}** tanesi çevrimiçi ve **${voiceMember}** tanesi seslide bulunmakta.`,
        })

        message.channel.send({ embeds: [embed] });
    }
}