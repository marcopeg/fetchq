
const { PlannedWorker } = require('./planned-worker.class')

class WorkersPool {
    constructor (ctx, settings = {}) {
        this.ctx = ctx
        this.workers = []
        this.isRunning = false
    }

    start () {
        this.isRunning = true
        return Promise.all(this.workers.map(w => w.start()))
    }

    register (config) {
        const worker = new PlannedWorker(this.ctx, config)
        this.workers.push(worker)

        if (!this.isRunning) {
            return Promise.resolve()
        }

        return worker.start()
    }
}

module.exports = {
    WorkersPool,
}
