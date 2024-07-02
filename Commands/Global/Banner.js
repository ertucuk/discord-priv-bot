const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'banner',
    aliases: [],

    execute: async (client, message, args) => {
        const member = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : null) || message.author;
        if (!member) return message.channel.send({ content: 'Bir kullanıcı belirtmelisin.' });

        const banner = await bannerURL(member.id, client);
        if (!banner) return message.channel.send({ content: 'Bu kullanıcının bannerı bulunamadı.' });

        message.channel.send({
            embeds: [
                new EmbedBuilder({
                    author: { name: member.username, iconURL: member.displayAvatarURL({ dynamic: true }) },
                    image: { url: banner },
                })
            ]
        });
    }
}

async function bannerURL(user, client) {
    const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
    if (!response.data.banner) return 
    if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
    else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
}