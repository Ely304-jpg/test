const alive = async (m, sock) => {
  try {
    const prefix = '.'; // adapte si tu changes de préfixe
    const body = m.body || '';
    const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : body.trim().toLowerCase();

    // Exécuter seulement si le message est exactement "alive" ou "inconnu"
    if (cmd !== 'alive' && cmd !== 'inconnu') return;

    const aliveText = `
━━━━━━━━━━━━━━━
*INCONNU XD V2 IS ACTIVE* 
━━━━━━━━━━━━━━━

✅ Bot: *ONLINE*
📅 Date: ${new Date().toLocaleDateString('en-GB')}
🕒 Time: ${new Date().toLocaleTimeString('en-GB')}
👤 User: @${m.sender.split('@')[0]}
💻 Version: 2.0.0

━━━━━━━━━━━━━━━
    `;

    const profilePictureUrl = "https://i.postimg.cc/BvY75gbx/IMG-20250625-WA0221.jpg";

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: aliveText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "INCONNU-XD-V2",
          newsletterJid: "120363397722863547@newsletter",
        },
        mentionedJid: [m.sender],
      },
    }, { quoted: m });

  } catch (err) {
    console.error("[ALIVE ERROR]:", err.message);
  }
};

export default alive;
