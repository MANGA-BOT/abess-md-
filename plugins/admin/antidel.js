const fs = require("fs")

module.exports = {
    name: "antidel",
    groupOnly: true,
    adminOnly: true,

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid
        const file = "./database/antidelete.json"

        let data = {}

        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file))
        }

        if (!data[from]) {
            data[from] = {
                on: false,
                ghost: false,
                ignoreAdmin: true
            }
        }

        const group = data[from]
        const cmd = args[0]

        if (cmd === "on") group.on = true
        else if (cmd === "off") group.on = false
        else if (cmd === "ghost") group.ghost = !group.ghost
        else if (cmd === "admin") group.ignoreAdmin = !group.ignoreAdmin
        else {
            return sock.sendMessage(from, {
                text:
`❌ Usage:
.antidelete on/off
.antidelete ghost
.antidelete admin`
            }, { quoted: msg })
        }

        fs.writeFileSync(file, JSON.stringify(data, null, 2))

        await sock.sendMessage(from, {
            text:
`🛡️ AntiDelete config:

✔ Status: ${group.on}
👻 Ghost: ${group.ghost}
👑 Ignore Admin: ${group.ignoreAdmin}

> 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
        }, { quoted: msg })
    }
}