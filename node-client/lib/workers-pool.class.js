
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
        const concurrency = config.concurrency ||  1
        const workers = []

        for (let i = 0; i < concurrency; i++) {
            const worker = new PlannedWorker(this.ctx, {
                ...config,
                index: i,
            })
            workers.push(worker)
        }
        
        this.workers = [
            ...this.workers,
            ...workers,
        ]

        console.log(this.workers)

        if (!this.isRunning) {
            return Promise.resolve()
        }

        return Promise.all(workers.map(worker => worker.start()))
    }
}

module.exports = {
    WorkersPool,
}
