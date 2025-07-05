import config from '../../config.cjs';

const kickAll2 = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'kickall2') return; // Only proceed if the command is 'kickall2'
    if (!m.isGroup) return m.reply("🔒 *Group Command Only!*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("❌ *I need to be admin to perform this action!*");
    if (!senderAdmin) return m.reply("🚫 *Only group admins can use this command!*");

    // Filter non-admin members
    const users = participants.filter(p => !p.admin).map(p => p.id);

    if (users.length === 0) {
      return m.reply("⚠️ *No non-admin members to kick!*");
    }

    m.reply(`⚠️ *INCONNU XD is initiating the purge...*\n👥 *${users.length} user(s) will be removed one by one.*`);

    // Remove each user one by one with dramatic flair
    for (const user of users) {
      try {
        await gss.groupParticipantsUpdate(m.from, [user], 'remove');
        await gss.sendMessage(m.from, {
          text: `💣 *Purge Complete:*\n👤 @${user.split('@')[0]} has been kicked!`,
          mentions: [user]
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec between each kick
      } catch (e) {
        console.error(`❗ Failed to kick ${user}:`, e);
      }
    }

    m.reply(`✅ *Kickall2 Complete!*\n🔪 *INCONNU XD has finished the purge.*\n🏷️ Group: *${groupMetadata.subject}*`);
  } catch (error) {
    console.error('Error in kickall2:', error);
    m.reply("💥 *An unexpected error occurred while executing kickall2.*");
  }
};

export default kickAll2;
