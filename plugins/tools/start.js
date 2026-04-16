const { sendButtons } = require("../../utils/sendButtons")

module.exports = {
    name: "start",

    async execute(sock, msg, args) {
        const from = msg.key.remoteJid

        const text = "📋 *MENU ABESS-MD*\n\nChoisis une option :"
        const footer = "🚀 ABESS BOT"

        const buttons = [
            {
                buttonId: ".ping",
                buttonText: { displayText: "🏓 Ping" },
                type: 1
            },
            {
                buttonId: ".owner",
                buttonText: { displayText: "👤 Owner" },
                type: 1
            }
        ]

        await sendButtons(sock, from, text, footer, buttons, msg)
    }
}