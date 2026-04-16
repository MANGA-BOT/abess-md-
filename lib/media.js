// 📤📥 MEDIA PRO (COMMONJS VERSION)

const {
  downloadMediaMessage,
  normalizeMessageContent
} = require("@whiskeysockets/baileys")

const axios = require("axios")
const FormData = require("form-data")

// ===== DOWNLOAD =====
async function getMediaBuffer(sock, msg) {
  try {
    if (!msg.message) return null

    const content = normalizeMessageContent(msg.message)
    const messageType = Object.keys(content)[0]

    const mediaTypes = [
      "imageMessage",
      "videoMessage",
      "audioMessage",
      "documentMessage",
      "stickerMessage"
    ]

    if (!mediaTypes.includes(messageType)) return null

    const buffer = await downloadMediaMessage(
      { message: content, key: msg.key },
      "buffer",
      {},
      { reuploadRequest: sock.updateMediaMessage }
    )

    return { buffer, messageType }

  } catch (err) {
    console.log("❌ getMediaBuffer error:", err.message)
    return null
  }
}

// ===== IMG UPLOAD =====
async function imgbb(buffer) {
  const form = new FormData()
  form.append("image", buffer.toString("base64"))

  const res = await axios.post("https://api.imgbb.com/1/upload", form, {
    params: { key: "254b685aea07ed364f7091dee628d26b" },
    headers: form.getHeaders()
  })

  return res.data?.data?.url
}

// ===== CATBOX =====
async function catbox(buffer, ext = "mp4") {
  const form = new FormData()
  form.append("reqtype", "fileupload")
  form.append("fileToUpload", buffer, { filename: `file.${ext}` })

  const res = await axios.post("https://catbox.moe/user/api.php", form, {
    headers: form.getHeaders()
  })

  return res.data
}

// ===== UPLOAD =====
async function uploadMedia(msg) {
  try {
    if (!msg.message) return null

    const content = normalizeMessageContent(msg.message)
    const type = Object.keys(content)[0]

    const buffer = await downloadMediaMessage(
      { message: content, key: msg.key },
      "buffer",
      {},
      {}
    )

    if (type === "imageMessage") {
      try {
        return await imgbb(buffer)
      } catch {
        return await catbox(buffer, "png")
      }
    }

    return await catbox(buffer, "mp4")

  } catch (err) {
    console.log("❌ uploadMedia error:", err.message)
    return null
  }
}

module.exports = {
  getMediaBuffer,
  uploadMedia
}