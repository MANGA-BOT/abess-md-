const fs = require("fs")

module.exports = {
  name: "delsudo",
  ownerOnly: true,

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid

    if (!args[0]) {
      return sock.sendMessage(from, {
        text: "❌ 𝑬𝒙𝒆𝒎𝒑𝒆 : .𝒅𝒆𝒍𝒔𝒖𝒅𝒐 2376xxxxxxx"
      }, { quoted: msg })
    }

    const number = args[0].replace(/[^0-9]/g, "")

    let sudo = []

    try {
      sudo = JSON.parse(fs.readFileSync("./database/sudo.json"))
    } catch {}

    sudo = sudo.filter(n => n !== number)

    fs.writeFileSync("./database/sudo.json", JSON.stringify(sudo, null, 2))

    await sock.sendMessage(from, {
      text: `❌ ${number} 𝒓𝒆𝒕𝒊𝒓𝒆 𝒅𝒆𝒔 𝒔𝒖𝒅𝒐
      > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
    }, { quoted: msg })
  }
}