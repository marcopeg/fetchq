const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe('FetchQ createQueue', function () {
    beforeEach(async function () {
        await pg.reset()
    })

    it('should create a new queue', async function () {
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
