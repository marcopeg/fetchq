const winston = require('winston')

class Maintenance {
    constructor (ctx, settings = {}) {
        this.ctx = ctx
        this.settings = settings
        this.delay = this.settings.delay || 1250

        this.isRunning = false
        this.isStopping = false
        this.hasStopped = false
        this.timer = null
    }

    start () {
        this.isRunning = true
        this.isStopping = false
        this.hasStopped = false
        this.loop()
    }

    async stop () {
        clearTimeout(this.timer)
        this.isRunning = false
        this.isStopping = false
        this.hasStopped = false

        // loop to check if it has stopped
        // we will release the promise at the end
    }

    async loop () {
        if (!this.isRunning) {
            return
        }
        try {
            await this.job()
        } catch (err) {
            winston.error(`[fetchq daemon] ${err.message}`)
        } finally {
            this.timer = setTimeout(() => this.loop(), this.delay)
        }
    }

    async job () {
        console.log('job')
        await this.ctx.pool.query('select * from fetchq_mnt_job_run();')
    }
}

module.exports = {
     Maintenance,
}
