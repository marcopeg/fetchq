
class PlannedWorker {
    constructor (ctx, settings) {
        this.ctx = ctx

        // generic worker stuff
        this.name = settings.name || `${settings.queue}-default`
        this.queue = settings.queue
        this.version = settings.version || 0
        this.handler = settings.handler
        this.delay = settings.delay ||  1000

        // loop maintenance
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

    stop() {
        this.isRunning = false
        this.isStopping = false
        this.hasStopped = false

        if (this.timer === null) {
            this.hasStopped = true
            return Promise.resolve()
        }

        return new Promise((resolve) => {
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

        // iterate
        try {
            await this.job()
        } catch (err) {
            this.ctx.logger.error(`[fetchq worker] ${err.message}`)
        } finally {
            this.timer = setTimeout(() => this.loop(), this.delay)
        }
    }

    async job () {
        this.ctx.logger.verbose(`job worker ${this.name}`)
        const docs = await this.ctx.doc.pick(this.queue, this.version, 1, '5s')
        const jobs = docs.map(async (doc) => {
            try {
                const res = await this.handler(doc)
                await this.resolve(doc, res)
            } catch (err) {
                try {
                    await this.ctx.doc.reject(
                        this.queue,
                        doc.subject,
                        'unhandled Exception',
                        {
                            message: err.message,
                            err: JSON.stringify(err),
                        },
                        '*'
                    )
                } catch (err) {
                    this.ctx.logger.error(`[fetchq] planned worker ${this.name}: ${err.message}`)
                    this.ctx.logger.debug(err)
                }
            }
        })

        return Promise.all(jobs)
    }

    async resolve (doc, res) {
        switch (res.action) {
            case 'reschedule':
                await this.ctx.doc.reschedule(
                    this.queue,
                    doc.subject,
                    res.nextIteration,
                    res.payload
                )
                break
            case 'reject':
                await this.ctx.doc.reject(
                    this.queue,
                    doc.subject,
                    res.message,
                    res.details,
                    res.refId
                )
                break
            case 'kill':
                await this.ctx.doc.kill(
                    this.queue,
                    doc.subject,
                    res.payload
                )
                break
            case 'complete':
                await this.ctx.doc.complete(
                    this.queue,
                    doc.subject,
                    res.payload
                )
                break
            case 'drop':
                await this.ctx.doc.drop(
                    this.queue,
                    doc.subject
                )
                break
            default:
                throw new Error('unrecognised action')
        }
    }
}

module.exports = {
    PlannedWorker,
}
