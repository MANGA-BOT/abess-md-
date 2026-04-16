const queue = []
let running = false

async function runQueue() {
    if (running) return
    running = true

    while (queue.length > 0) {
        const job = queue.shift()
        try {
            await job()
        } catch (e) {
            console.log("Queue error:", e)
        }
    }

    running = false
}

function add(job) {
    queue.push(job)
    runQueue()
}

module.exports = { add }