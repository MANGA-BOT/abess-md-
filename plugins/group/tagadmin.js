module.exports = {
    name: "tagadmin",
    groupOnly: true,

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const metadata = await sock.groupMetadata(from)

        const admins = metadata.participants
            .filter(p => p.admin !== null)

        const mentions = admins.map(a => a.id)

        let text = ".           .👑 𝑨𝑫𝑴𝑰𝑵𝑺........\n\n"

        for (let a of admins) {
            text += `➤ @${a.id.split("@")[0]}\n`
        }
// signature > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫

text += `\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`

        await sock.sendMessage(from, {
            text,
            mentions
        }, { quoted: msg })
    }
}