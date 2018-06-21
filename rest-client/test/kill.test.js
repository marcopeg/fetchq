const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe('FetchQ kill', function () {
    let doc = null
    beforeEach(async function () {
        await pg.reset()
        await request.post(url('/v1/q')).send({ name: 'foo' })
        await request.post(url('/v1/q/foo')).send({
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

    it('should set a document as kill', async function () {
        const r1 = await request.post(url('/v1/kill')).send({
            queue: 'foo',
            documentId: doc.id,
        })

        // test on collected metrics
        await request.post(url('/v1/mnt/run/all'))
        await request.post(url('/v1/metric/log/pack'))
        const r2 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
            metric: 'kll',
        })

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.body.current_value).to.equal(1)
    })

    it('should set a document as kill - with payload', async function () {
        const r1 = await request.post(url('/v1/kill')).send({
            queue: 'foo',
            documentId: doc.id,
            payload: {
                ...doc.payload,
                killed: true,
            },
        })

        // test on the outcome in the db
        const r2 = await pg.query(`select * from fetchq__foo__documents where id = ${doc.id} and status = -1`)

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.rows[0].payload.killed).to.equal(true)
    })
})
