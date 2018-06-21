const moment = require('moment')
const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')


describe('FetchQ reschedule', function () {
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

    it('should set a document as rescheduled', async function () {
        // console.log(doc)
        const r1 = await request.post(url('/v1/reschedule')).send({
            queue: 'foo',
            documentId: doc.id,
        })

        // test on collected metrics
        await request.post(url('/v1/mnt/run/all'))
        await request.post(url('/v1/metric/log/pack'))
        const r2 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
            metric: 'res',
        })

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.body.current_value).to.equal(1)
    })

    it('should reschedule in the future', async function () {
        // console.log(doc)
        const r1 = await request.post(url('/v1/reschedule')).send({
            queue: 'foo',
            documentId: doc.id,
            nextIteration: moment().add(1, 'year'),
        })

        // test on collected metrics
        await request.post(url('/v1/mnt/run/all'))
        await request.post(url('/v1/metric/log/pack'))
        const r2 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
            metric: 'pln',
        })

        expect(r1.body.affected_rows).to.equal(1)
        expect(r2.body.current_value).to.equal(1)
    })

    it('should reschedule with payload', async function () {
        await request.post(url('/v1/reschedule')).send({
            queue: 'foo',
            documentId: doc.id,
            payload: {
                ...doc.payload,
                res: true,
            },
        })

        const r1 = await pg.query(`select * from fetchq__foo__documents where id = ${doc.id}`)
        expect(r1.rows[0].payload.res).to.equal(true)
    })

    it('should reschedule in the past', async function () {
        await request.post(url('/v1/reschedule')).send({
            queue: 'foo',
            documentId: doc.id,
            nextIteration: moment().subtract(1, 'year'),
            payload: {
                ...doc.payload,
                res: true,
            },
        })

        // re-pick the document that was scheduled as pending
        await request.post(url('/v1/mnt/run/all'))
        await request.post(url('/v1/metric/log/pack'))
        const doc1 = (await request.post(url('/v1/pick')).send({
            queue: 'foo',
            limit: 1,
        })).body.shift()

        expect(doc.id).to.equal(doc1.id)
    })
})
