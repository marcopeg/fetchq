
class Maintenance {
    constructor (ctx, settings = {}) {
        this.ctx = ctx
        this.settings = settings
        this.delay = this.settings.delay || 25
        this.sleep = this.settings.sleep || 2500

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
        let delay = this.delay
        try {
            this.ctx.logger.verbose(`[fetchq] run maintenance job`)
            const res = await this.ctx.pool.query('select * from fetchq_mnt_job_run();')
            if (!res.rows[0].success) {
                this.ctx.logger.verbose(`[fetchq] maintenance job is sleeping for ${this.sleep}ms`)
                delay = this.sleep
            }
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
