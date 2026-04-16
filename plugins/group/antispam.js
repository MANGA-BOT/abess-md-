const { setGroupSetting } = require("../../lib/groupSettings")

module.exports = {
    name: "antispam",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆: .𝑎𝑛𝑡𝑖𝑠𝑝𝑎𝑚 𝑜𝑛/𝑜𝑓𝑓"
            }, { quoted: msg })
        }

        setGroupSetting(from, "antispam", state === "on")

        await sock.sendMessage(from, {
            text: `🚫 𝑨𝒏𝒕𝒊𝑺𝒑𝒂𝒎 ${state}`
        }, { quoted: msg })
    }
}