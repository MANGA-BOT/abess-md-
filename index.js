// 🚀 ABESS-MD - POINT D'ENTRÉE PRO OPTIMISÉ

const { connectToWhatsApp } = require('./core/client')
const { loadPlugins } = require('./core/handler')
const config = require('./config')

// ===== 🔥 ANTI CRASH GLOBAL =====
process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err.message)
})

process.on("unhandledRejection", (err) => {
    console.error("💥 Unhandled Rejection:", err?.message || err)
})

// ===== 🔥 START =====
async function start() {
    try {
        console.log(`🤖 𝑫𝒆𝒎𝒂𝒓𝒓𝒂𝒈𝒆 𝒅𝒆 ${config.BOT_NAME}...`)

        // 🔥 LOAD PLUGINS
        loadPlugins()

        // 🔥 CONNECT
        await connectToWhatsApp()

    } catch (e) {
        console.error("❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒄𝒓𝒊𝒕𝒊𝒒𝒖𝒆:", e.message)

        // 🔥 RESTART AUTO
        setTimeout(() => {
            console.log("🔄 Redémarrage du bot...")
            start()
        }, 5000)
    }
}

// ===== 🔥 KEEP ALIVE =====
setInterval(() => {
    console.log("🟢 Bot actif...")
}, config.KEEP_ALIVE || 30000)

// ===== 🔥 LANCEMENT =====
start()
