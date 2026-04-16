module.exports = {

    name: "add",
    aliases: [],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const isGroup = from.endsWith("@g.us")

        if (!isGroup) {
            return sock.sendMessage(
                from,
                { text: "❌ 𝑪𝒐𝒎𝒎𝒂𝒏𝒅𝒆 𝒈𝒓𝒐𝒖𝒑𝒆 𝒖𝒏𝒊𝒒𝒖𝒆𝒎𝒆𝒏𝒕." },
                { quoted: msg }
            )
        }

        try {

            // ===== RÉCUP NUMÉRO =====
            let number = args[0]

            // si mention
            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
                number = msg.message.extendedTextMessage.contextInfo.mentionedJid[0]
            }

            if (!number) {
                return sock.sendMessage(
                    from,
                    { text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆 : .𝑎𝑑𝑑 2376xxxxxxx" },
                    { quoted: msg }
                )
            }

            // nettoyage numéro
            number = number.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

            // ===== AJOUT =====
            const res = await sock.groupParticipantsUpdate(from, [number], "add")

            // ===== RESULT =====
            const status = res[0]?.status

            if (status === "200") {
                await sock.sendMessage(
                    from,
                    { text: "✅ 𝑼𝒕𝒊𝒍𝒊𝒔𝒂𝒕𝒆𝒖𝒓 𝒂𝒋𝒐𝒖𝒕𝒆𝒓 𝒂𝒗𝒆𝒄 𝒔𝒖𝒄𝒄𝒆𝒔." },
                    { quoted: msg }
                )
            } else if (status === "403") {
                await sock.sendMessage(
                    from,
                    { text: "⚠️ 𝑰𝒎𝒑𝒐𝒔𝒔𝒊𝒃𝒍𝒆 𝒅'𝒂𝒋𝒐𝒖𝒕𝒆𝒓. 𝑰𝒏𝒗𝒊𝒕𝒂𝒕𝒊𝒐𝒏 𝒆𝒏𝒗𝒐𝒚𝒆𝒆𝒓." },
                    { quoted: msg }
                )
            } else {
                await sock.sendMessage(
                    from,
                    { text: "❌ 𝑬𝒄𝒉𝒆𝒄 𝒅𝒆 𝒍'𝒂𝒋𝒐𝒖𝒕." },
                    { quoted: msg }
                )
            }

        } catch (err) {

            console.log("ADD ERROR:", err)

            await sock.sendMessage(
                from,
                { text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒍𝒐𝒓𝒔 𝒅𝒆 𝒍'𝒂𝒋𝒐𝒖𝒕." },
                { quoted: msg }
            )
        }
    }
}