const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe('FetchQ createQueue', function () {
    beforeEach(async function () {
        await pg.reset()
    })

    describe('create', function () {
        it.skip('should create a new queue', async function () {
            const res = await request.post(url('/v1/q')).send({ name: 'foo' })
            expect(res.statusCode).to.equal(200)
            expect(res.body.was_created).to.equal(true)
        })

        it('should not create the queue twice', async function () {
            const r1 = await request.post(url('/v1/q')).send({ name: 'foo' })
            const r2 = await request.post(url('/v1/q')).send({ name: 'foo' })

            expect(r2.statusCode).to.equal(200)
            expect(r1.body.queue_id).to.equal(r2.body.queue_id)
        })
    })

    describe('drop', function () {
        let queueId = null

        beforeEach(async function () {
            const res = await request.post(url('/v1/q')).send({ name: 'foo' })
            queueId = res.body.queue_id
        })

        it.skip('should drop a queue', async function () {
            const res = await request.delete(url('/v1/q/foo'))
            expect(res.statusCode).to.equal(200)
            expect(res.body.was_dropped).to.equal(true)
            expect(res.body.queue_id).to.equal(queueId)
        })

        it('should not drop a queue twice', async function () {
            await request.delete(url('/v1/q/foo'))
            const res = await request.delete(url('/v1/q/foo'))
            expect(res.statusCode).to.equal(200)
            expect(res.body.was_dropped).to.equal(false)
        })

        it.skip('should give a new id to a queue that was dropped', async function () {
            await request.delete(url('/v1/q/foo'))
            const res = await request.post(url('/v1/q')).send({ name: 'foo' })
            expect(queueId).to.not.equal(res.body.queue_id)
        })
    })
})
