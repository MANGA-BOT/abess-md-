module.exports = {
    name: "kick",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const quoted = msg.message?.extendedTextMessage?.contextInfo

        if (!quoted || !quoted.participant) {
            return sock.sendMessage(from, {
                text: "❌ 𝑹𝒆𝒑𝒐𝒏𝒅 𝒂 𝒖𝒏 𝒎𝒆𝒏𝒃𝒓𝒆"
            }, { quoted: msg })
        }

        const user = quoted.participant

        await sock.groupParticipantsUpdate(from, [user], "remove")

        await sock.sendMessage(from, {
            text: `🚫 @${user.split("@")[0]} 𝑬𝒙𝒑𝒖𝒍𝒔𝒆𝒓`,
            mentions: [user]
        }, { quoted: msg })
    }
}