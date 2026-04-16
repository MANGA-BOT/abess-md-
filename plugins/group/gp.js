module.exports = {
    name: "gp",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        const action = args[0]

        if (!["open", "close"].includes(action)) {
            return sock.sendMessage(from, {
                text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆: .𝑔𝑟𝑜𝑢𝑝 𝑜𝑝𝑒𝑛/𝑐𝑙𝑜𝑠𝑒"
            }, { quoted: msg })
        }

        try {
            await sock.groupSettingUpdate(
                from,
                action === "open" ? "not_announcement" : "announcement"
            )

            await sock.sendMessage(from, {
                text: action === "open"
                    ? "🔓 𝑮𝒓𝒐𝒖𝒑𝒆 𝑶𝒖𝒗𝒆𝒓𝒕"
                    : "🔒 𝑮𝒓𝒐𝒖𝒑𝒆 𝑭𝒆𝒓𝒎𝒆𝒓"
            }, { quoted: msg })

        } catch (e) {
            await sock.sendMessage(from, {
                text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒑𝒆𝒓𝒎𝒊𝒔𝒔𝒊𝒐𝒏 𝒂𝒅𝒎𝒊𝒏"
            }, { quoted: msg })
        }
    }
}