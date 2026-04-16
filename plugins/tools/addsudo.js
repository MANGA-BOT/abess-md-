const fs = require("fs")

module.exports = {
  name: "addsudo",
  ownerOnly: true,

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid

    if (!args[0]) {
      return sock.sendMessage(from, {
        text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒍𝒆 : .𝑎𝑑𝑑𝑠𝑢𝑑𝑜 2376xxxxxxx"
      }, { quoted: msg })
    }

    const number = args[0].replace(/[^0-9]/g, "")

    let sudo = []

    try {
      sudo = JSON.parse(fs.readFileSync("./database/sudo.json"))
    } catch {}

    if (sudo.includes(number)) {
      return sock.sendMessage(from, {
        text: "⚠️ 𝑫𝒆𝒋𝒂 𝒔𝒖𝒅𝒐"
      }, { quoted: msg })
    }

    sudo.push(number)

    fs.writeFileSync("./database/sudo.json", JSON.stringify(sudo, null, 2))

    await sock.sendMessage(from, {
      text: `✅ ${number} 𝒆𝒔𝒕 𝒎𝒂𝒊𝒏𝒕𝒆𝒏𝒂𝒏𝒕 𝑺𝑼𝑫𝑶
      > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
    }, { quoted: msg })
  }
}