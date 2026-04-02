module.exports = {
    name: "demote",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const quoted = msg.message?.extendedTextMessage?.contextInfo

        if (!quoted || !quoted.participant) {
            return sock.sendMessage(from, {
                text: "❌ 𝑹𝒆𝒑𝒐𝒏𝒅 𝒂 𝒖𝒏 𝒂𝒅𝒎𝒊𝒏"
            }, { quoted: msg })
        }

        const user = quoted.participant

        await sock.groupParticipantsUpdate(from, [user], "demote")

        await sock.sendMessage(from, {
            text: `⬇️ @${user.split("@")[0]} 𝒏'𝒆𝒔𝒕 𝒑𝒍𝒖𝒔 𝒂𝒅𝒎𝒊𝒏
            > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`,
            mentions: [user]
        }, { quoted: msg })
    }
}