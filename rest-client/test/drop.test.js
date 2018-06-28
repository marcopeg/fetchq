const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe('FetchQ drop', function () {
    this.timeout(10000)
    
    let doc = null
    beforeEach(async function () {
        await pg.reset()
        await request.post(url('/v1/queue')).send({ name: 'foo' })
        await request.post(url('/v1/queue/foo')).send({
            subject: 'a1',
            version: 0,
            priority: 0,
            payload: { a: 3 },
        })
        await request.post(url('/v1/metric/log/pack')).send()
        doc = (await request.post(url('/v1/pick')).send({
            queue: 'foo',
            limit: 1,
        })).body.shift()
    })

    it('should drop a document', async function () {
        const r1 = await request.post(url('/v1/drop')).send({
            queue: 'foo',
            subject: doc.subject,
        })

        // test on collected metrics
        await request.post(url('/v1/mnt/run'))
        await request.post(url('/v1/metric/log/pack'))
        const r2 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
            metric: 'drp',
        })

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.body.current_value).to.equal(1)
    })
})
