
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

    stop () {
        this.isRunning = false
        this.isStopping = false
        this.hasStopped = false

        return new Promise((resolve) => {
            if (this.timer === null) {
                this.hasStopped = true
                return resolve()
            }

            const checkStopInterval = setInterval(() => {
                if (this.hasStopped) {
                    clearInterval(checkStopInterval)
                    resolve()
                }
            }, 500)
        })
    }

    async loop () {
        // clear out the timeout
        clearTimeout(this.timer)
        this.timer = null
        
        // check for termination signal
        if (!this.isRunning) {
            this.hasStopped = true
            return
        }

        // do the job
        try {
            this.ctx.logger.debug(`[fetchq] run maintenance job`)
            await this.ctx.pool.query('select * from fetchq_mnt_job_run();')
        } catch (err) {
            this.ctx.logger.error(`[fetchq daemon] ${err.message}`)
        } finally {
            this.timer = setTimeout(() => this.loop(), this.delay)
        }
    }
}

module.exports = {
     Maintenance,
}
