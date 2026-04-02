// utils/downloader.js

const fs = require("fs")
const path = require("path")
const axios = require("axios")
const { exec } = require("child_process")
const util = require("util")

const execAsync = util.promisify(exec)

// ===================== CHECK YT-DLP =====================
async function checkAndInstallYtDlp() {
  try {
    try {
      if (process.platform === "win32") {
        await execAsync(".\\yt-dlp.exe --version")
      } else {
        await execAsync("./yt-dlp --version")
      }
      console.log("✅ yt-dlp déjà installé (local)")
      return true
    } catch {
      await execAsync("yt-dlp --version")
      console.log("✅ yt-dlp trouvé dans PATH")
      return true
    }
  } catch {
    console.log("📦 Installation de yt-dlp...")

    try {
      const cwd = process.cwd()

      if (process.platform === "win32") {
        await execAsync(
          `powershell -Command "Invoke-WebRequest -Uri 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' -OutFile '${cwd}\\yt-dlp.exe'"`
        )
      } else {
        await execAsync(
          `curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ${cwd}/yt-dlp`
        )
        await execAsync(`chmod a+rx ${cwd}/yt-dlp`)
      }

      return true
    } catch (err) {
      console.error("❌ install yt-dlp:", err.message)
      return false
    }
  }
}

// ===================== PLATFORM =====================
function getPlatformFromUrl(url) {
  if (url.includes("tiktok.com")) return "TikTok"
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube"
  if (url.includes("facebook.com") || url.includes("fb.watch")) return "Facebook"
  if (url.includes("instagram.com")) return "Instagram"
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter/X"
  if (url.includes("soundcloud.com")) return "SoundCloud"
  return "Autre"
}

// ===================== SEARCH YOUTUBE =====================
async function searchYouTubeVideo(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
    const res = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000
    })

    const html = res.data

    const match = html.match(/"videoId":"([^"]{11})"/)
    if (match) return `https://www.youtube.com/watch?v=${match[1]}`

    const alt = html.match(/watch\?v=([^"&]{11})/)
    if (alt) return `https://www.youtube.com/watch?v=${alt[1]}`

    return null
  } catch {
    return null
  }
}

// ===================== SEARCH ALT =====================
async function searchAlternativeVideo(query) {
  try {
    const ytMusic = await axios.get(
      `https://music.youtube.com/search?q=${encodeURIComponent(query)}`
    )

    const id = ytMusic.data.match(/"videoId":"([^"]{11})"/)
    if (id) {
      return {
        source: "youtube_music",
        url: `https://music.youtube.com/watch?v=${id[1]}`
      }
    }
  } catch {}

  try {
    const sc = await axios.get(
      `https://soundcloud.com/search?q=${encodeURIComponent(query)}`
    )

    const match = sc.data.match(/<a href="(\/[^"]+\/[^"]+)"/)
    if (match) {
      return {
        source: "soundcloud",
        url: `https://soundcloud.com${match[1]}`
      }
    }
  } catch {}

  return null
}

// ===================== CORE DOWNLOAD =====================
async function downloadVideoUniversal(url) {
  return downloadCore(url, false)
}

async function downloadVideoUniversalAlmighty(url) {
  return downloadCore(url, true)
}

// ===================== CORE ENGINE =====================
async function downloadCore(url, almighty = false) {
  const tempDir = "temp_downloads"
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

  const timestamp = Date.now()
  const output = path.join(tempDir, `video_${timestamp}.mp4`)
  const temp = path.join(tempDir, `temp_${timestamp}`)

  try {
    const ok = await checkAndInstallYtDlp()
    if (!ok) throw new Error("yt-dlp indisponible")

    const bin = process.platform === "win32" ? "yt-dlp.exe" : "./yt-dlp"

    let cmds = []

    if (almighty && (url.includes("youtube") || url.includes("youtu.be"))) {
      cmds = [
        `${bin} "${url}" --extractor-args "youtube:player-client=tv,android,web" -f "b[height<=720]/b" -o "${temp}.%(ext)s" --quiet`,
        `${bin} "${url}" --extractor-args "youtube:player-client=ios" -f "b" -o "${temp}.mp4" --quiet`,
        `${bin} "${url}" -f "b" -o "${temp}.mp4" --quiet`
      ]
    } else {
      cmds = [
        `${bin} "${url}" -f "b[height<=720]/b" -o "${temp}.%(ext)s" --quiet`,
        `${bin} "${url}" -f "best" -o "${output}" --quiet`
      ]
    }

    let success = false

    for (let cmd of cmds) {
      try {
        await execAsync(cmd, { timeout: 180000 })
        success = true
        break
      } catch {}
    }

    if (!success) throw new Error("Download failed")

    const files = fs.readdirSync(tempDir)

    let found =
      files.find(f => f.startsWith(`temp_${timestamp}`)) ||
      files.sort((a, b) =>
        fs.statSync(path.join(tempDir, b)).mtimeMs -
        fs.statSync(path.join(tempDir, a)).mtimeMs
      )[0]

    if (!found) throw new Error("No file")

    let filePath = path.join(tempDir, found)

    if (!filePath.endsWith(".mp4")) {
      const newPath = filePath.replace(/\.[^/.]+$/, ".mp4")
      fs.renameSync(filePath, newPath)
      filePath = newPath
    }

    if (filePath !== output) fs.renameSync(filePath, output)

    const stats = fs.statSync(output)

    if (stats.size === 0) {
      fs.unlinkSync(output)
      throw new Error("Empty file")
    }

    return {
      success: true,
      path: output,
      size: stats.size
    }

  } catch (err) {

    try {
      fs.readdirSync(tempDir)
        .filter(f => f.includes(timestamp))
        .forEach(f => fs.unlinkSync(path.join(tempDir, f)))
    } catch {}

    return {
      success: false,
      error: err.message
    }
  }
}

// ===================== EXPORT =====================
module.exports = {
  getPlatformFromUrl,
  searchYouTubeVideo,
  searchAlternativeVideo,
  downloadVideoUniversal,
  downloadVideoUniversalAlmighty
}