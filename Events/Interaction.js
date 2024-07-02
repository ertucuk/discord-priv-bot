const client = global.client;
const { Events, ModalBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputStyle, TextInputBuilder, StringSelectMenuBuilder, UserSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const room = require('../Schema/Room');
const count = require('../Schema/Count');
var RTCRegions;
const { voiceChannelId, memberRole } = require('../System');

client.on(Events.InteractionCreate, async (i) => {

    if (i.isButton()) {
        if (i.customId == 'register') {
            if (i.member.roles.cache.has(memberRole)) {
                return i.reply({ content: 'Zaten kayıtlısın!', ephemeral: true });
            }
    
            const labelCounter = await count.findOneAndUpdate({}, { $inc: { count: 1 } }, { new: true, upsert: true });
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('register')
                        .setLabel(`Kayıt Ol - ${labelCounter?.count}`)
                        .setStyle(ButtonStyle.Secondary)
                );
    
            await i.member.roles.add(memberRole);
            await i.reply({ content: 'Başarıyla kayıt oldun!', ephemeral: true });
            await i.message.edit({ components: [row] });
        }

        if (i.customId === 'name') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const row = new ModalBuilder()
                .setTitle('İsim Değiştir')
                .setCustomId('changingName')
                .setComponents(
                    new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelName").setLabel("Oda ismini giriniz.").setStyle(TextInputStyle.Short)),
                );

            i.showModal(row)
        }

        if (i.customId === 'limit') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const row = new ModalBuilder()
                .setTitle('Limit Değiştir')
                .setCustomId('changingLimit')
                .setComponents(
                    new ActionRowBuilder().setComponents(new TextInputBuilder().setCustomId("channelLimit").setLabel("Oda limitini giriniz.").setStyle(TextInputStyle.Short)),
                );

            i.showModal(row)
        }

        if (i.customId === 'lock') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            await channel.permissionOverwrites.create(i.guild.roles.everyone, { 1048576: false })
            i.reply({ content: 'Oda kilitlendi.', ephemeral: true });
        }

        if (i.customId === 'unlock') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            await channel.permissionOverwrites.create(i.guild.roles.everyone, { 1048576: true })
            i.reply({ content: 'Oda açıldı.', ephemeral: true });
        }

        if (i.customId === 'invite') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId('inviteUser')
                        .setPlaceholder('Kullanıcı ara.')
                        .setMinValues(1)
                        .setMaxValues(1)
                )

            i.reply({ content: 'Kullanıcı davet etmek için menüden kullanıcı seçin.', components: [row], ephemeral: true });
        }

        if (i.customId === 'visible') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            channel.permissionOverwrites.create(i.guild.roles.everyone, { 1024: true });
            i.reply({ content: 'Oda görünür yapıldı.', ephemeral: true });
        }

        if (i.customId === 'invisible') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            channel.permissionOverwrites.create(i.guild.roles.everyone, { 1024: false });
            i.reply({ content: 'Oda görünmez yapıldı.', ephemeral: true });
        }

        if (i.customId === 'openChat') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: true });
            i.reply({ content: 'Oda sohbeti açıldı.', ephemeral: true });
        }

        if (i.customId === 'closeChat') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            channel.permissionOverwrites.edit(i.guild.roles.everyone, { SendMessages: false });
            i.reply({ content: 'Oda sohbeti kapandı.', ephemeral: true });
        }

        if (i.customId === 'changeRegion') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            RTCRegions = await client.fetchVoiceRegions()

            var options = [];

            options.push({
                label: "Auto",
                value: 'null',
                default: !channel.rtcRegion,
            })

            RTCRegions.forEach((Region) => {
                options.push({
                    label: Region.name,
                    value: Region.id,
                    default: channel.rtcRegion == Region.id,
                })
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('changeRegions')
                        .setPlaceholder('Bir bölge seçin.')
                        .setOptions(options)
                )


            i.reply({ components: [row], ephemeral: true });
        }

        if (i.customId === 'add') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const row = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId('addUser')
                        .setPlaceholder('Kullanıcı ara.')
                        .setMinValues(1)
                        .setMaxValues(20)
                )

            i.reply({ content: 'Aşağıdan eklemek istediğiniz kullanıcıları seçin.', components: [row], ephemeral: true });
        }

        if (i.customId === 'remove') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);

            const members = channel.members
                .filter(x => i.guild.members.cache.get(x.id) && x.id !== secretRoom.ownerId)
                .map(x => {
                    const username = i.guild.members.cache.get(x.id).user.username;
                    return {
                        label: username,
                        value: x.id,
                    };
                });

            if (members.length === 0) return i.reply({ content: 'Kanalınızda çıkarılacak kullanıcı bulunmamaktadır.', ephemeral: true });

            const membersArray = [...members];

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('removeUser')
                        .setPlaceholder('Kullanıcı ara.')
                        .setOptions(membersArray.slice(0, membersArray.length))
                        .setMinValues(membersArray.length)
                        .setMaxValues(membersArray.length)
                )

            i.reply({ content: 'Aşağıdan çıkarmak istediğiniz kullanıcıları seçin.', components: [row], ephemeral: true });
        }


        if (i.customId === 'disconnect') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);

            if (channel.members.size === 0) return i.reply({ content: 'Kanalınızda koparılacak kullanıcı bulunmamaktadır.', ephemeral: true });

            const members = channel.members
                .filter(x => i.guild.members.cache.get(x.id) && x.id !== secretRoom.ownerId)
                .map(x => {
                    const username = i.guild.members.cache.get(x.id).user.username;
                    return {
                        label: username,
                        value: x.id,
                    };
                });

            if (members.length === 0) return i.reply({ content: 'Kanalınızda koparılacak kullanıcı bulunmamaktadır.', ephemeral: true });

            const membersArray = [...members];

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('disconnectUser')
                        .setPlaceholder('Kullanıcı ara.')
                        .setOptions(membersArray.slice(0, membersArray.length))
                        .setMinValues(membersArray.length)
                        .setMaxValues(membersArray.length)
                )

            i.reply({ content: 'Aşağıdan koparmak istediğiniz kullanıcıları seçin.', components: [row], ephemeral: true });

        }

        if (i.customId === 'give') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);

            if (channel.members.size === 0) return i.reply({ content: 'Kanalınızda devredilecek kullanıcı bulunmamaktadır.', ephemeral: true });

            const members = channel.members
                .filter(x => i.guild.members.cache.get(x.id) && x.id !== secretRoom.ownerId)
                .map(x => {
                    const username = i.guild.members.cache.get(x.id).user.username;
                    return {
                        label: username,
                        value: x.id,
                    };
                });

            if (members.length === 0) return i.reply({ content: 'Kanalınızda devredilecek kullanıcı bulunmamaktadır.', ephemeral: true });

            const membersArray = [...members];

            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('giveUser')
                        .setPlaceholder('Kullanıcı ara.')
                        .setOptions(membersArray.slice(0, 25))
                )

            i.reply({ content: 'Aşağıdan devretmek istediğiniz kullanıcıları seçin.', components: [row], ephemeral: true });
        }

        if (i.customId === 'delete') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const lockChannel = i.guild.channels.cache.get(secretRoom.id)
            lockChannel.delete()
            await room.deleteMany({ ownerId: i.user.id });
            i.reply({ content: 'Oda silindi.', ephemeral: true });
        }
    }

    if (i.isModalSubmit()) {
        if (i.customId === 'changingName') {
            const RoomName = i.fields.getTextInputValue("channelName");
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const channel = await i.guild.channels.cache.get(secretRoom.id);

            channel.edit({ name: RoomName });
            i.reply({ content: `Oda ismi değiştirildi.`, ephemeral: true });
        }
    }

    if (i.isModalSubmit()) {
        if (i.customId === 'changingLimit') {
            const RoomLimit = i.fields.getTextInputValue("channelLimit");
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const channel = await i.guild.channels.cache.get(secretRoom.id);

            channel.edit({ userLimit: RoomLimit > 99 ? 99 : RoomLimit });
            i.reply({ content: `Oda limiti değiştirildi.`, ephemeral: true });
        }
    }

    if (i.isAnySelectMenu()) {
        if (i.customId === 'inviteUser') {
            const user = i.values[0];
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const memberxd = i.guild.members.cache.get(i.user.id);
            if (!memberxd.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);

            const member = await i.guild.members.fetch(user);
            if (member.id === i.user.id) return i.reply({ content: 'Kendinizi davet edemezsiniz.', ephemeral: true });
            if (channel.permissionOverwrites.cache.has(member.id)) return i.reply({ content: 'Kullanıcı zaten odada.', ephemeral: true });

            channel.permissionOverwrites.create(member.id, { 1048576: true });

            const createInvite = await channel.createInvite({ maxAge: 0, maxUses: 1 });
            member.send({ content: `<@${i.user.id}> sizi özel odasına davet etti. [Katılmak için tıkla](${createInvite.url})` });
            i.reply({ content: 'Kullanıcı davet edildi.', ephemeral: true });
        }

        if (i.customId === 'addUser') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            const users = i.values;
            if (i.values.includes(i.user.id)) return i.reply({ content: 'Kendinizi ekleyemezsiniz.', ephemeral: true });

            users.forEach(async user => {
                const member = await i.guild.members.fetch(user);
                if (channel.permissionOverwrites.cache.has(member.id)) return i.reply({ content: 'Kullanıcı zaten odada.', ephemeral: true });
                channel.permissionOverwrites.create(member.id, { 1048576: true });
            });

            i.reply({ content: 'Kullanıcı(lar) eklendi.', ephemeral: true });
        }

        if (i.customId === 'removeUser') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            const users = i.values;

            users.forEach(async user => {
                const member = await i.guild.members.fetch(user);
                member.voice.disconnect();
                channel.permissionOverwrites.delete(member.id);
            });

            i.reply({ content: 'Kullanıcı(lar) çıkarıldı.', ephemeral: true });
        }

        if (i.customId === 'disconnectUser') {
            const users = i.values;
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            users.forEach(async user => {
                const member = await i.guild.members.fetch(user);
                member.voice.disconnect();
            });

            i.reply({ content: 'Kullanıcı(lar) atıldı.', ephemeral: true });
        }

        if (i.customId === 'giveUser') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            const users = i.values[0];

            const newOwner = await i.guild.members.fetch(users);
            await room.updateOne({ id: channel.id }, { ownerId: newOwner.id });
            i.reply({ content: 'Oda devredildi.', ephemeral: true });
        }

        if (i.customId === 'changeRegions') {
            const secretRoom = await room.findOne({ ownerId: i.user.id });
            const member = i.guild.members.cache.get(i.user.id);
            if (!member.voice.channel) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Kanal Bulunamadı!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Geçerli bir ses kanalında değilsiniz. Lütfen bir ses kanalına katıldığınızdan emin olun:\n\n <#${voiceChannelId}>`,
                    })
                ], ephemeral: true
            });

            if (i.user.id !== secretRoom?.ownerId) return i.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Hata!',
                        image: { url: 'https://tempvoice.xyz/embeds/discord/copyright-fail.png' },
                        description: `Bu komutu kullanabilmek için odanın sahibi olmalısınız.`,
                    })
                ], ephemeral: true
            });

            const channel = await i.guild.channels.cache.get(secretRoom.id);
            const region = i.values[0];

            channel.edit({ rtcRegion: region === 'null' ? null : region });
            i.reply({ content: 'Bölge değiştirildi.', ephemeral: true });
        }
    }
})