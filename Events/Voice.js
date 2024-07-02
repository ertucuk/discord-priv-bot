const client = global.client;
const { Events, ChannelType } = require("discord.js");
const { voiceChannelId } = require('../System');
const room = require('../Schema/Room');

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (newState.channelId === voiceChannelId) {

        const member = newState.guild.members.cache.get(newState.id);

        const roomControl = await room.findOne({ ownerId: member.id });
        if (roomControl) {
            const channel = newState.guild.channels.cache.get(roomControl.id);
            if (channel) {
                await channel.delete();
                await room.deleteOne({ id: roomControl.id });
            }
        }

        const newChannel = await newState.guild.channels.create({
            name: `${newState.member.user.username}'nun Kanalı`,
            type: ChannelType.GuildVoice,
            parent: newState.channel.parentId,
        });

        newState.setChannel(newChannel);
        new room({ id: newChannel.id, ownerId: newState.member.id }).save()
    }
})