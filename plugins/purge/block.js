module.exports = {
    name: 'block',
    aliases: ['bloquer'],
    category: 'tools',
    ownerOnly: true,

    async execute(sock, msg, args, { isOwner, isGroup, isSudo, sudoList }) {
        const chatId = msg.key.remoteJid
        const targetNum = args[0]?.replace(/[^0-9]/g, '')

        console.log('🔍 BLOCK DEBUG:', { targetNum, args })

        if (!targetNum || targetNum.length < 10) {
            console.log('❌ Numéro invalide')
            return sock.sendMessage(chatId, { react: { text: '❌', key: msg.key } })
        }

        const target = `${targetNum}@s.whatsapp.net`
        console.log('🎯 Target JID:', target)

        try {
            // 🔍 LISTE ACTUELLE
            const blockedList = await sock.fetchBlocklist()
            console.log('📋 Blocked list length:', blockedList.length)
            
            const isBlocked = blockedList.some(user => user.id === target)
            console.log('✅ Is blocked?', isBlocked)

            if (isBlocked) {
                console.log('⛔ Déjà bloqué')
                return sock.sendMessage(chatId, { react: { text: '⛔', key: msg.key } })
            }

            // 🚀 ESSAI BLOCK
            console.log('🔄 Tentative block...')
            await sock.updateBlockStatus(target, true)
            console.log('✅ BLOCK ENVOYÉ !')

            // 🔍 VÉRIF APRÈS
            const newList = await sock.fetchBlocklist()
            const nowBlocked = newList.some(user => user.id === target)
            console.log('🔒 Confirmé?', nowBlocked)

            sock.sendMessage(chatId, { react: { text: nowBlocked ? '🔒' : '❓', key: msg.key } })

        } catch (err) {
            console.error('💥 BLOCK ERROR:', err.message)
            sock.sendMessage(chatId, { react: { text: '💥', key: msg.key } })
        }
    }
}