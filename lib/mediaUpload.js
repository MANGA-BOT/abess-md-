const { downloadContentFromMessage } = require("@whiskeysockets/baileys")
const fs = require("fs")
const path = require("path")

async function uploadMedia(msg) {
    try {
        const type = Object.keys(msg)[0]

        const stream = await downloadContentFromMessage(
            msg[type],
            type.replace("Message", "")
        )

        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        // sauvegarde temporaire
        const fileName = `./temp/${Date.now()}.jpg`

        if (!fs.existsSync("./temp")) fs.mkdirSync("./temp")

        fs.writeFileSync(fileName, buffer)

        // 👉 upload via telegra.ph (simple)
        const FormData = require("form-data")
        const axios = require("axios")

        const form = new FormData()
        form.append("file", fs.createReadStream(fileName))

        const res = await axios.post("https://telegra.ph/upload", form, {
            headers: form.getHeaders()
        })

        fs.unlinkSync(fileName)

        return "https://telegra.ph" + res.data[0].src

    } catch (e) {
        console.log("Upload error:", e)
        return null
    }
}

module.exports = { uploadMedia }