module.exports = {

    name: "delete",
    aliases: ["del"],

    async execute(sock, msg, args) {

        const from = msg.key.remoteJid

        try {

            const mode = args[0]?.toLowerCase()

            // ===== STORE SIMPLE EN MÉMOIRE =====
            if (!global.messageStore) global.messageStore = new Map()

            // ===== DEL SIMPLE (reply) =====
            if (!mode) {
                const quoted = msg.message?.extendedTextMessage?.contextInfo

                if (!quoted?.stanzaId) {
                    return sock.sendMessage(from, {
                        text: "❌ 𝑹𝒆𝒑𝒐𝒏𝒅𝒔 𝒂𝒖 𝒎𝒆𝒔𝒔𝒂𝒈𝒆 𝒂 𝒔𝒖𝒑𝒑𝒓𝒊𝒎𝒆𝒓."
                    }, { quoted: msg })
                }

                return await sock.sendMessage(from, {
                    delete: {
                        remoteJid: from,
                        fromMe: false,
                        id: quoted.stanzaId,
                        participant: quoted.participant
                    }
                })
            }

            // ===== DEL BOT =====
            if (mode === "bot") {

                let count = 0

                for (let [id, m] of global.messageStore) {
                    if (m.key.fromMe && m.key.remoteJid === from) {

                        await sock.sendMessage(from, {
                            delete: m.key
                        }).catch(() => {})

                        count++
                    }
                }

                return sock.sendMessage(from, {
                    text: `🤖 ${count} 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒅𝒖 𝒃𝒐𝒕 𝒔𝒖𝒑𝒑𝒓𝒊𝒎𝒆𝒔.
                    > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
                }, { quoted: msg })
            }

            // ===== DEL ME =====
            if (mode === "me") {

                let count = 0

                for (let [id, m] of global.messageStore) {
                    if (!m.key.fromMe && m.key.remoteJid === from) {

                        await sock.sendMessage(from, {
                            delete: m.key
                        }).catch(() => {})

                        count++
                    }
                }

                return sock.sendMessage(from, {
                    text: `👤 ${count} 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒔𝒖𝒑𝒑𝒓𝒊𝒎𝒆𝒔.
                    > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
                }, { quoted: msg })
            }

            // ===== DEL ALL =====
            if (mode === "all") {

                let count = 0

                for (let [id, m] of global.messageStore) {
                    if (m.key.remoteJid === from) {

                        await sock.sendMessage(from, {
                            delete: m.key
                        }).catch(() => {})

                        count++
                    }
                }

                return sock.sendMessage(from, {
                    text: `🧹 ${count} 𝒎𝒆𝒔𝒔𝒂𝒈𝒆𝒔 𝒔𝒖𝒑𝒑𝒓𝒊𝒎𝒆𝒔 (𝒕𝒐𝒕𝒂𝒍).
                    > 🚀 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 𝑨𝑩𝑬𝑺𝑺-𝑴𝑫`
                }, { quoted: msg })
            }

        } catch (err) {

            console.log("DEL ERROR:", err)

            await sock.sendMessage(from, {
                text: "❌ 𝑬𝒓𝒓𝒆𝒖𝒓 𝒔𝒖𝒑𝒑𝒓𝒆𝒔𝒔𝒊𝒐𝒏."
            }, { quoted: msg })
        }
    }
}