
const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

const weirdPayload = {
    num: 123,
    bool: true,
    nil: null,
    nan: NaN,
    und: undefined,
    ar1: [ 1, 2, 3 ],
    s1: 'marco',
    s2: 'mar"co',
    s3: 'ma\'rco',
    ob: {
        foo: 123,
    },
}

describe('FetchQ upsert', function () {
    this.timeout(10000)

    beforeEach(async function () {
        await pg.reset()
        await request.post(url('/v1/queue')).send({
            name: 'foo',
        })
    })

    describe('single document', function () {
        it('should upsert a non existing document', async function () {
            const res = await request.post(url('/v1/queue/foo/upsert')).send({
                subject: 'a1',
                version: 0,
                priority: 0,
                nextIteration: '2018-10-10 12:22',
                payload: {
                    a: 1,
                },
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(1)
            expect(res.body.updated_docs).to.equal(0)
        })

        it('should update an existing document', async function () {
            await request.post(url('/v1/queue/foo/upsert')).send({
                subject: 'a1',
                version: 0,
                priority: 0,
                nextIteration: '2018-10-10 12:22',
                payload: {
                    a: 1,
                },
            })
            const res = await request.post(url('/v1/queue/foo/upsert')).send({
                subject: 'a1',
                priority: 1,
                nextIteration: '2222-10-10 12:22',
                payload: weirdPayload,
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(0)
            expect(res.body.updated_docs).to.equal(1)
        })

        it('should NOT update an active document', async function () {
            await request.post(url('/v1/queue/foo/upsert')).send({
                subject: 'a1',
                nextIteration: '1024-10-10 12:22',
            })
            await request.post(url('/v1/doc/pick')).send({ queue: 'foo' })

            const res = await request.post(url('/v1/queue/foo/upsert')).send({
                subject: 'a1',
                priority: 1,
                nextIteration: '2222-10-10 12:22',
                payload: {
                    a: 2,
                },
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(0)
            expect(res.body.updated_docs).to.equal(0)
        })
    })
})
