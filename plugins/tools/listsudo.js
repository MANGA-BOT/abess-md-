const fs = require("fs")

module.exports = {
  name: "listsudo",
  ownerOnly: true,

  async execute(sock, msg) {
    const from = msg.key.remoteJid

    let sudo = []

    try {
      sudo = JSON.parse(fs.readFileSync("./database/sudo.json"))
    } catch {}

    if (!sudo.length) {
      return sock.sendMessage(from, {
        text: "❌ 𝑨𝒖𝒄𝒖𝒏 𝒔𝒖𝒅𝒐"
      }, { quoted: msg })
    }

    let text = "👑 𝑳𝑰𝑺𝑻𝑬 𝑺𝑼𝑫𝑶 :\n\n"

    sudo.forEach((n, i) => {
      text += `${i + 1}. ${n}\n`
    })
text += `\n> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`

    await sock.sendMessage(from, {
      text
    }, { quoted: msg })
  }
}