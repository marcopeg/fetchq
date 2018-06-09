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
    ob: { foo: 123 },
}

describe('FetchQ push', function () {
    let queueId = null

    beforeEach(async function () {
        await pg.reset()
        const res = await request.post(url('/v1/q')).send({ name: 'foo' })
        queueId = res.body.queue_id
    })

    describe('single document', function () {
        it('should schedule a future document', async function () {
            const res = await request.post(url('/v1/q/foo')).send({
                subject: 'a1',
                version: 0,
                priority: 0,
                nextIteration: '2018-10-10 12:22',
                payload: { a: 1 },
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(1)
        })

        it('should schedule a pending document', async function () {
            const res = await request.post(url('/v1/q/foo')).send({
                subject: 'a1',
                version: 0,
                priority: 0,
                nextIteration: '2016-10-10 12:22',
                payload: { a: 2 },
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(1)
        })

        it('should schedule a document with a complex payload', async function () {
            const res = await request.post(url('/v1/q/foo')).send({
                subject: 'a1',
                version: 0,
                priority: 0,
                nextIteration: '2016-10-10 12:22',
                payload: weirdPayload,
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(1)
        })
    })

    describe.only('multiple documents', function () {
        it('should queue multiple documents', async function () {
            const res = await request.post(url('/v1/q/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [ {
                    subject: 'a1',
                    priority: 0,
                    payload: { a: 1 },
                }, {
                    subject: 'a2',
                    priority: 1,
                    payload: { a: 2 },
                } ],
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(2)
        })

        it('should queue multiple documents without duplicates', async function () {
            const res = await request.post(url('/v1/q/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [ {
                    subject: 'a1',
                    priority: 0,
                    payload: { a: 1 },
                }, {
                    subject: 'a1',
                    priority: 1,
                    payload: { a: 2 },
                } ],
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(1)
        })

        it('should queue multiple documents with weird payloads', async function () {
            const res = await request.post(url('/v1/q/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [ {
                    subject: 'a1',
                    priority: 0,
                    payload: weirdPayload,
                }, {
                    subject: 'a2',
                    priority: 1,
                    payload: weirdPayload,
                } ],
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(2)
        })
    })

})
