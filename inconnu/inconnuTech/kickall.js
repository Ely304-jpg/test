import config from '../../config.cjs';

const kickAll = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd !== 'kickall') return; // Only proceed if the command is 'kickall'
    if (!m.isGroup) return m.reply("🔒 *Group Command Only!*");

    const groupMetadata = await gss.groupMetadata(m.from);
    const participants = groupMetadata.participants;
    const botAdmin = participants.find(p => p.id === botNumber)?.admin;
    const senderAdmin = participants.find(p => p.id === m.sender)?.admin;

    if (!botAdmin) return m.reply("❌ *I need to be admin to perform this action!*");
    if (!senderAdmin) return m.reply("🚫 *Only group admins can use this command!*");

    // Collect all non-admin members to remove
    const users = participants
      .filter(p => !p.admin) // Exclude admins
      .map(p => p.id);

    if (users.length === 0) {
      return m.reply("⚠️ *No non-admin members to kick!*");
    }

    await gss.groupParticipantsUpdate(m.from, users, 'remove')
      .then(() => {
        const kickedNames = users.map(user => `@${user.split('@')[0]}`).join(', ');
        m.reply(`✅ *Kick Successful!*\n👤 Users kicked: ${kickedNames}\n🏷️ Group: *${groupMetadata.subject}*`);

        // Styled follow-up message
        gss.sendMessage(m.from, {
          text: `⚠️ *INCONNU XD has unleashed the purge!*\n💣 Kicked: ${kickedNames}\n🫡 *Order restored.*`,
          mentions: users
        });
      })
      .catch(() => m.reply("❗ *Failed to kick user(s). Please try again.*"));
  } catch (error) {
    console.error('Error:', error);
    m.reply("💥 *An unexpected error occurred while processing your command.*");
  }
};

export default kickAll;
