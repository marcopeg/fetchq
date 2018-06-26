/* global before, after */
const moment = require('moment')
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe.skip('Load Test', function () {
    this.timeout(60 * 1000 * 60)
    const queue = 'foo'
    const docs = 5000000
    const chunk = 10000
    const iterations = 2
    const limit = 250

    const logs = []
    
    before(async function () {
        await pg.reset()
        await request.post(url('/v1/q')).send({ name: 'foo' })
    })

    after(function () {
        console.log('')
        console.log('')
        console.log('>>> Test results:')
        logs.forEach(l => console.log(l))
    })

    it('should populate large amount of data', async function () {
        const res = await populateQueue({
            queue,
            docs,
            chunk,
        })
        console.log(res)
        logs.push(res)
    })

    describe('process documents', function () {
        it('should pick and **reschedule** from massive amount of data', async function () {
            const r2 = await processQueue({
                queue,
                action: 'reschedule',
                iterations,
                limit,
                nextIteration: moment().add(1, 'day'),
            })
            console.log(r2)
            logs.push(r2)
        })

        it('should pick and **reject** from massive amount of data', async function () {
            const r2 = await processQueue({
                queue,
                action: 'reject',
                iterations,
                limit,
                nextIteration: moment().subtract(1, 'day'),
            })
            console.log(r2)
            logs.push(r2)
        })

        it('should pick and **complete** from massive amount of data', async function () {
            const r2 = await processQueue({
                queue,
                action: 'complete',
                iterations,
                limit,
                nextIteration: moment().subtract(1, 'day'),
            })
            console.log(r2)
            logs.push(r2)
        })

        it('should pick and **kill** from massive amount of data', async function () {
            const r2 = await processQueue({
                queue,
                action: 'kill',
                iterations,
                limit,
                nextIteration: moment().subtract(1, 'day'),
            })
            console.log(r2)
            logs.push(r2)
        })

        it('should pick and **drop** from massive amount of data', async function () {
            const r2 = await processQueue({
                queue,
                action: 'drop',
                iterations,
                limit,
                nextIteration: moment().subtract(1, 'day'),
            })
            console.log(r2)
            logs.push(r2)
        })
    })

})

const randomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))

const populateQueue = async (settings = {}) => {
    const queue = settings.queue || 'foo'
    const docs = settings.docs ||  10000
    const chunk = settings.chunk ||  10000
    const nextIteration = settings.nextIteration || randomDate(moment().subtract(30, 'days').toDate(), moment().add(3, 'days').toDate())
    const version = settings.version || 0

    const il = Math.ceil(docs / chunk)

    const elapsed = []
    let queuedDocs = 0   
    for (let i = 0; i < il; i++) {
        const docs = []
        for (let j = 0; j < chunk; j++) {
            docs.push({
                subject: `i${i}-j${j}`,
                priority: 0,
            })
        }

        if (i > 0) {
            const totalElapsed = elapsed.reduce((a, b) => a + b, 0)
            const dps = Math.round(i * chunk * 1000 / totalElapsed)
            console.log(`${dps} docs/s - ${Math.round((i + 1)/il*100)}%`)
        }

        const start = new Date()
        const res = await request.post(url(`/v1/q/${queue}`)).send({
            version,
            nextIteration,
            docs,
        })
        queuedDocs += res.body.queued_docs
        elapsed.push(new Date() - start)

        await request.post(url('/v1/mnt/run'))
        await request.post(url('/v1/metric/log/pack'))
    }

    const totalElapsed = elapsed.reduce((a, b) => a + b, 0)
    const dps = Math.round(il * chunk * 1000 / totalElapsed)
    return `${dps} docs/s - ${queuedDocs} documents were pushed in ${totalElapsed}ms`
}

const processQueue = async (settings = {}) => {
    const queue = settings.queue || 'foo'
    const action = settings.action || 'reschedule'
    const iterations = settings.iterations || 1
    const limit = settings.limit || 1
    const nextIteration = settings.nextIteration || moment().add(1, 'day')

    let totalElapsed = 0
    let processedDocs = 0
    for (let i = 0; i < iterations; i++) {
        if (i > 0) {
            const dps = Math.round(processedDocs * 1000 / totalElapsed)
            console.log(`${dps} docs/s - ${Math.round((i + 1)/iterations*100)}%`)
        }

        const start = new Date()
        const docs = (await request.post(url('/v1/pick')).send({
            queue,
            limit,
        })).body

        const pdocs = docs.map(doc => request.post(url(`/v1/${action}`)).send({
            queue,
            subject: doc.subject,
            nextIteration,
        }))
        await Promise.all(pdocs)
        processedDocs += docs.length
        totalElapsed += new Date() - start

        await request.post(url('/v1/mnt/run'))
        await request.post(url('/v1/metric/log/pack'))
    }
    
    const dps = Math.round(processedDocs * 1000 / totalElapsed)
    return `${dps} docs/s - ${processedDocs} ${action}ed docs in ${totalElapsed}ms`
}