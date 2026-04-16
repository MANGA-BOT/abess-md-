module.exports = {
    name: "kickall",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const metadata = await sock.groupMetadata(from)

        const participants = metadata.participants

        const admins = participants
            .filter(p => p.admin !== null)
            .map(p => p.id)

        const users = participants
            .map(p => p.id)
            .filter(id => !admins.includes(id))

        if (users.length === 0) {
            return sock.sendMessage(from, {
                text: "❌ 𝑨𝒖𝒄𝒖𝒏 𝒎𝒆𝒏𝒃𝒓𝒆 𝒂 𝒆𝒙𝒑𝒖𝒍𝒔𝒆𝒓..."
            }, { quoted: msg })
        }

        await sock.groupParticipantsUpdate(from, users, "remove")

        await sock.sendMessage(from, {
            text: "🔥 𝑻𝒐𝒖𝒔 𝒍𝒆𝒔 𝒎𝒆𝒏𝒃𝒓𝒆𝒔 𝒐𝒏𝒕 𝒆𝒕𝒆 𝒆𝒙𝒑𝒖𝒍𝒔𝒆𝒔"
        }, { quoted: msg })
    }
}