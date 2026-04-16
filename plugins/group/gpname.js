module.exports = {
    name: "gpname",
    aliases: ["setname", "gname"],
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const text = args.join(" ")

        // 🔥 NEWSLETTER
        const contextInfo = {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363408842235507@newsletter",
                newsletterName: "𒆜 𝙰𝚋𝚎𝚜𝚜-𝙼𝙳 𒆜",
                serverMessageId: 1
            }
        }

        if (!text) {
            return sock.sendMessage(from, {
                text: "❌ Exemple : .gpname Nouveau nom du groupe",
                contextInfo
            }, { quoted: msg })
        }

        try {

            await sock.groupUpdateSubject(from, text)

            await sock.sendMessage(from, {
                text: "✅ Nom du groupe modifié avec succès",
                contextInfo
            }, { quoted: msg })

        } catch (e) {
            console.log("GPNAME ERROR:", e.message)

            sock.sendMessage(from, {
                text: "❌ Impossible de changer le nom\nVérifie que je suis admin",
                contextInfo
            }, { quoted: msg })
        }
    }
}