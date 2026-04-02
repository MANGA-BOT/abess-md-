async function sendButtons(sock, jid, text, footer, buttons, quoted = null) {
    try {
        const buttonMessage = {
            text: text,
            footer: footer,
            buttons: buttons,
            headerType: 1
        }

        await sock.sendMessage(jid, buttonMessage, { quoted })

    } catch (err) {
        console.log("❌ sendButtons error:", err.message)
    }
}

module.exports = { sendButtons }