module.exports = {
    name: "hidetag",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        const metadata = await sock.groupMetadata(from)
        const participants = metadata.participants

        const mentions = participants.map(p => p.id)

        const text = args.join(" ") || "📢 𝑴𝑬𝑺𝑺𝑨𝑮𝑬"

        await sock.sendMessage(from, {
            text,
            mentions
        }, { quoted: msg })
    }
}