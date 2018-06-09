const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe.only('FetchQ push', function () {
    let queueId = null

    beforeEach(async function () {
        await pg.reset()
        const res = await request.post(url('/v1/q')).send({ name: 'foo' })
        queueId = res.body.queue_id
    })

    it('should push a new document', async function () {
        const res = await request.post(url('/v1/q/foo')).send({ subject: 'foo' })
        console.log(res.body)
        expect(res.statusCode).to.equal(200)
    })
})
