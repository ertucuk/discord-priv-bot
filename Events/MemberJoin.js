const { Events } = require("discord.js");
const { joinLeaveChannel } = require('../System');
const canvafy = require("canvafy");

client.on(Events.GuildMemberAdd, async (member) => {
    const welcome = await new canvafy.WelcomeLeave()
        .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: "png" }))
        .setBackground('image', member.guild.bannerURL() ? member.guild.bannerURL({ dynamic: true }) : 'https://img001.prntscr.com/file/img001/Wjpq6aDSRO6IzA1UMdwv5g.jpg')
        .setTitle(`${member?.user?.username}`)
        .setDescription("Sunucumuza Katıldı!")
        .setBorder("#2a2e35")
        .setAvatarBorder("#008000")
        .setOverlayOpacity(0.3)
        .build();


    member.guild.channels.cache.get(joinLeaveChannel).send({
        files: [{
            attachment: welcome,
            name: `ertu-${member.id}.png`
        }]
    });
})