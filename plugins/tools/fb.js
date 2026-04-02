const axios = require('axios')

module.exports = {
    name: 'facebook',
    aliases: ['fb', 'fbdl'],
    desc: 'Télécharge une vidéo Facebook',
    
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid
        const url = args.join(' ').trim()
        
        if (!url) {
            return sock.sendMessage(from, { 
                text: '❌ Envoie un lien Facebook !\nEx: .fb https://fb.watch/abc123' 
            }, { quoted: msg })
        }

        await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } })

        try {
            const API_KEY = 'gifted'
            const { data } = await axios.get(
                `https://api.giftedtech.co.ke/api/download/facebook?apikey=${API_KEY}&url=${encodeURIComponent(url)}`,
                { timeout: 15000 }
            )
            
            if (data.success && data.result) {
                const hdUrl = data.result.hd_video || data.result.sd_video
                const title = data.result.title || 'Facebook Video'
                
                await sock.sendMessage(from, { 
                    video: { url: hdUrl }, 
                    caption: `📘 *${title}*\n\n✅ ABESS-MD Downloader` 
                }, { quoted: msg })
                
                await sock.sendMessage(from, { react: { text: '✅', key: msg.key } })
            } else {
                throw new Error('API Fail')
            }
        } catch (error) {
            console.log('FB Error:', error.message)
            sock.sendMessage(from, { 
                text: '❌ Erreur téléchargement\nVidéo privée ou lien invalide' 
            }, { quoted: msg })
        }
    }
}