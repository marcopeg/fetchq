
class Maintenance {
    constructor (ctx, settings = {}) {
        this.ctx = ctx
        this.settings = settings
        this.limit = this.settings.limit || 1
        this.delay = this.settings.delay || 25
        this.sleep = this.settings.sleep || (this.delay * 10)

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
            const res = await this.ctx.pool.query(`select * from fetchq_mnt_job_run(${this.limit});`)
            if (res.rows[0].processed < this.limit) {
                this.ctx.logger.debug(`[fetchq] maintenance job has completer ${res.rows[0].processed}/${this.limit} therefore is sleeping for ${this.sleep}ms`)
                delay = this.sleep
            } else {
                this.ctx.logger.debug(`[fetchq] run maintenance job - ${res.rows[0].processed} processed`)
            }
        } catch (err) {
            this.ctx.logger.error(`[fetchq daemon] ${err.message}`)
            delay = this.sleep
        } finally {
            this.timer = setTimeout(() => this.loop(), delay)
        }
    }
}

module.exports = {
     Maintenance,
}
