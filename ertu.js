const { Client, Partials, GatewayIntentBits, Events, EmbedBuilder, ActivityType, Collection, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const system = require('./System');
const { readdir } = require('fs');
const room = require('./Schema/Room');

const linkCooldowns = new Map();
const reklamCooldowns = new Map();

const client = global.client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials) });

const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
readdir("./Commands/", (err, files) => {
    if (err) console.error(err)
    files.forEach(f => {
        readdir("./Commands/" + f, (err2, files2) => {
            if (err2) console.log(err2)
            files2.forEach(file => {
                let ertucum = require(`./Commands/${f}/` + file);
                console.log(`[KOMUT] ${ertucum.name} Yüklendi!`);
                commands.set(ertucum.name, ertucum);
                ertucum.aliases.forEach(alias => { aliases.set(alias, ertucum.name); });
            });
        });
    });
});

readdir("./Events/", (err, files) => {
    if (err) console.error(err)
    files.forEach(f => {
        require(`./Events/${f}`);
        console.log(`[EVENT] (${f.replace(".js", "")})`)
    });
});

client.on(Events.ClientReady, async () => {

    const activities = ['ertu was here ❤️', 'kizlar dm: ertu']

    client.user.setActivity({ name: 'ertu was here ❤️', type: ActivityType.Listening });
    client.user.setStatus('dnd');

    const channel = client.channels.cache.get(system.botVoiceChannelId);

    let vcStatus = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        group: client.user.id,
        selfDeaf: true,
        selfMute: true
    });

    vcStatus.on('error', (err) => {
        console.log(err);
        vcStatus.rejoin();
    });

    setInterval(async () => {
        const secretRooms = client.guilds.cache.get(system.guildId).channels.cache.filter((channel) => channel.parentId === system.parentId && channel.type === ChannelType.GuildVoice && channel.id !== system.voiceChannelId).map((channel) => channel);
        secretRooms.forEach(async (x) => {
            const channel = client.channels.cache.get(x.id);
            if (channel?.id === system.voiceChannelId) return;
            if (channel && channel.members.size === 0) {
                await channel.delete().catch((err) => { })
                await room.deleteOne({ id: x.id }).catch((err) => { })
            }
        });
    }, 10000);

    console.log(`[BOT] ${client.user.tag} olarak giriş yaptı!`);
});

client.on(Events.MessageCreate, async (message) => {

    const reklamRegex = /discord\.gg\/\w+|discordapp\.com\/invite\/\w+/gi;
    if (reklamRegex.test(message.content) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (!reklamCooldowns.has(message.author.id)) {
            reklamCooldowns.set(message.author.id, 1);
        } else {
            reklamCooldowns.set(message.author.id, reklamCooldowns.get(message.author.id) + 1);
        }

        if (reklamCooldowns.get(message.author.id) >= 5) {
            message.member.timeout(300000);
            reklamCooldowns.delete(message.author.id);
        }

        if (reklamCooldowns.get(message.author.id) <= 5) {
            message.delete();
            message.channel.send(`${message.author}, reklam yapmak yasaktır!`).then(s => setTimeout(() => s.delete().catch(err => { }), 5000));
        }
        return;
    }

    const linkRegex = /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi;
    if (linkRegex.test(message.content) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        if (!linkCooldowns.has(message.author.id)) {
            linkCooldowns.set(message.author.id, 1);
        } else {
            linkCooldowns.set(message.author.id, linkCooldowns.get(message.author.id) + 1);
        }

        if (linkCooldowns.get(message.author.id) >= 5) {
            message.member.timeout(300000);
            linkCooldowns.delete(message.author.id);
        }

        if (linkCooldowns.get(message.author.id) <= 5) {
            message.delete();
            message.channel.send(`${message.author}, linkler yasaktır!`).then(s => setTimeout(() => s.delete().catch(err => { }), 5000));
        }
        return;
    }
    
    if (system.prefix && !message.content.startsWith(system.prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    if (cmd) {
        cmd.execute(client, message, args);
    }
})

const mongoose = require("mongoose");
mongoose.connect(system.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("[BOT] MongoDB bağlandı!")
}).catch((err) => {
    throw err;
});

client.login(system.token);