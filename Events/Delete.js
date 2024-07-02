const { Events, AuditLogEvent } = require("discord.js");
const SecretRoom = require('../Schema/Room');

client.on(Events.ChannelDelete, async (channel) => {
        const log = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
        const entry = log.entries.first();
        const user = entry.executor;
        if (!user || user.bot) return;
        const secretRoom = await SecretRoom.findOne({ id: channel.id });
        if (!secretRoom) return;
        await SecretRoom.deleteMany({ id: channel.id });
})