const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')


describe('FetchQ reject', function () {
    this.timeout(10000)
    
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

    it('should set a document as rejected', async function () {
        const r1 = await request.post(url('/v1/reject')).send({
            queue: 'foo',
            subject: doc.subject,
            message: 'aaa',
            details: { e: true },
        })

        // test on collected metrics
        await request.post(url('/v1/mnt/run'))
        await request.post(url('/v1/metric/log/pack'))
        const r2 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
            metric: 'rej',
        })

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.body.current_value).to.equal(1)
    })

    it('should set a document as rejected with refId', async function () {
        const r1 = await request.post(url('/v1/reject')).send({
            queue: 'foo',
            subject: doc.subject,
            message: 'aaa',
            details: { e: true },
            refId: 'xxx',
        })

        // test on produced error in the database
        const r2 = await pg.query(`select * from fetchq__foo__errors`)

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.rows[0]['ref_id']).to.equal('xxx')
    })
})
