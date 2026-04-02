const { setGroupSetting } = require("../../lib/groupSettings")

module.exports = {
    name: "antilink",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const state = args[0]

        if (!["on", "off"].includes(state)) {
            return sock.sendMessage(from, {
                text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆: .𝑎𝑛𝑡𝑖𝑙𝑖𝑛𝑘 𝑜𝑛/𝑜𝑓𝑓"
            }, { quoted: msg })
        }

        setGroupSetting(from, "antilink", state === "on")

        await sock.sendMessage(from, {
            text: `🔗 𝑨𝒏𝒕𝒊𝒍𝒊𝒏𝒌 ${state} (3 𝒘𝒂𝒓𝒏𝒔 = 𝒌𝒊𝒄𝒌)`
        }, { quoted: msg })
    }
}