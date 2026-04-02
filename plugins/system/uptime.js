const os = require("os")

module.exports = {
    name: "uptime",

    async execute(sock, msg) {
        const from = msg.key.remoteJid

        const runtime = process.uptime()

        // ⏱️ format temps
        const formatTime = (s) => {
            const d = Math.floor(s / 86400)
            const h = Math.floor((s % 86400) / 3600)
            const m = Math.floor((s % 3600) / 60)
            const sec = Math.floor(s % 60)
            return `${d}j ${h}h ${m}m ${sec}s`
        }

        // 💾 RAM
        const used = process.memoryUsage().heapUsed / 1024 / 1024
        const total = os.totalmem() / 1024 / 1024

        // ⚙️ CPU
        const cpu = os.cpus()[0].model

        const caption = `
╭━━━〔 🕷 𝑼𝑷𝑻𝑰𝑴𝑬 🕷 〕━━━⬣
┃ 🕷 Temps : ${formatTime(runtime)}
┃ 🕷 RAM : ${used.toFixed(2)} MB / ${total.toFixed(0)} MB
┃ 🕷 CPU : ${cpu}
┃ 🕷 Statut : 🟢 ONLINE 
╰━━━━━━━━━━━━━━⬣
`

        // ===== 🖼️ IMAGE D'ABORD =====
        await sock.sendMessage(from, {
            image: { url: "https://files.catbox.moe/gsgr1m.jpg" },
            caption
        }, { quoted: msg })

        // ===== 🎧 AUDIO ENSUITE =====
        await sock.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/nyj5u7.ogg" },
            mimetype: "audio/mpeg", // ⚠️ corrigé (car .ogg)
            ptt: true
        }, { quoted: msg })
    }
}