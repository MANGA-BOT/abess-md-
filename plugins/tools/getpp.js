module.exports = {
    name: "getpp",
    aliases: ["pp"],

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        let target = msg.key.participant || from

        try {
            const pp = await sock.profilePictureUrl(target, "image")

            await sock.sendMessage(from, {
                image: { url: pp },
                caption: "📸 𝑷𝒉𝒐𝒕𝒐 𝒅𝒆 𝒑𝒓𝒐𝒇𝒊𝒍 \n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫"
            }, { quoted: msg })

        } catch {
            await sock.sendMessage(from, {
                text: "❌ 𝑰𝒎𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆 𝒅𝒆 𝒓𝒆𝒄𝒖𝒑𝒆𝒓𝒆𝒓 𝒍𝒂 𝒑𝒉𝒐𝒕𝒐"
            }, { quoted: msg })
        }
    }
}