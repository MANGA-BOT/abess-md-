module.exports = {
  name: "ping",
  aliases: ["test", "boom"],

  async execute(sock, msg, args) {
    try {
      const start = Date.now()

      const sent = await sock.sendMessage(
        msg.key.remoteJid,
        { text: "⚡ Test..." },
        { quoted: msg }
      )

      const latency = Date.now() - start

      await sock.sendMessage(
        msg.key.remoteJid,
        {
          edit: sent.key,
          text: `⚡ 𝑳𝒂𝒕𝒆𝒏𝒄𝒆 : ${latency} ms`
        }
      )

    } catch (e) {
      console.error(e)

      await sock.sendMessage(
        msg.key.remoteJid,
        { text: "❌ Erreur ping" },
        { quoted: msg }
      )
    }
  }
}