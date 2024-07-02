const { PermissionsBitField } = require('discord.js');
    
module.exports = {
    name: "sil",
    aliases: ["temizle"],

    execute: async (client, message, args) => {

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !message.member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return;
    
        const amount = args[0];
        if (!amount || isNaN(amount)) return message.reply({ content: `Bir sayı belirtmelisin.` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
        if (amount < 1 || amount > 100) return message.reply({ content: ` 1 ile 100 arasında bir sayı belirtmelisin.` }).then(s => setTimeout(() => s.delete().catch(err => {}), 5000));
    
        message.channel.bulkDelete(amount).catch(err => { });
        message.channel.send({ content: `Başarıyla **${amount}** adet mesaj silindi.` }).then(s => setTimeout(() => s.delete().catch(err => {}), 15000));
    }
}