const fs = require("fs")

module.exports = {
  name: "mode",
  aliases: ["setmode"],
  ownerOnly: true,

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid

    if (!args[0]) {
      return sock.sendMessage(from, {
        text:
          "⚙️ 𝑼𝑻𝑰𝑳𝑰𝑺𝑨𝑻𝑰𝑶𝑵 :\n" +
          ".𝑚𝑜𝑑𝑒 𝑝𝑢𝑏𝑙𝑖𝑐\n" +
          ".𝑚𝑜𝑑𝑒 𝑝𝑟𝑖𝑣𝑎𝑡𝑒"
      }, { quoted: msg })
    }

    const mode = args[0].toLowerCase()

    if (!["public", "private"].includes(mode)) {
      return sock.sendMessage(from, {
        text: "❌ 𝑴𝒐𝒅𝒆 𝒊𝒏𝒗𝒂𝒍𝒊𝒅𝒆 (𝑝𝑢𝑏𝑙𝑖𝑐 / 𝑝𝑟𝑖𝑣𝑎𝑡𝑒)"
      }, { quoted: msg })
    }

    // 🔥 sauvegarde
    fs.writeFileSync(
      "./database/mode.json",
      JSON.stringify({ mode }, null, 2)
    )

    await sock.sendMessage(from, {
      text: `✅ 𝑴𝒐𝒅𝒆 𝒄𝒉𝒂𝒏𝒈𝒆𝒓 𝒆𝒏 *${mode.toUpperCase()}*
      > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
    }, { quoted: msg })
  }
}