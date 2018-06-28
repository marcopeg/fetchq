const moment = require('moment')
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
    this.timeout(10000)

    beforeEach(async function () {
        await pg.reset()
        await request.post(url('/v1/queue')).send({ name: 'foo' })
    })

    describe('single document', function () {
        it('should schedule a future document', async function () {
            const res = await request.post(url('/v1/queue/foo')).send({
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
            const res = await request.post(url('/v1/queue/foo')).send({
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
            const res = await request.post(url('/v1/queue/foo')).send({
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

    describe('multiple documents', function () {
        it('should queue multiple documents', async function () {
            const res = await request.post(url('/v1/queue/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [
                    [ 'a1', 0, { a: 1} ],
                    [ 'a2', 0, { a: 2} ],
                ],
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(2)
        })

        it('should queue multiple documents without duplicates', async function () {
            const res = await request.post(url('/v1/queue/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [
                    [ 'a1', 0, { a: 1} ],
                    [ 'a1', 0, { a: 2} ],
                ],
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(1)
        })

        it('should queue multiple documents with weird payloads', async function () {
            const res = await request.post(url('/v1/queue/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [
                    [ 'a1', 0, weirdPayload ],
                    [ 'a2', 0, weirdPayload ],
                ],
            })
            expect(res.statusCode).to.equal(200)
            expect(res.body.queued_docs).to.equal(2)
        })

        it('should queue a single document with a specific date', async function () {
            const r1 = await request.post(url('/v1/queue/foo')).send({
                subject: 'a1',
                version: 0,
                priority: 0,
                nextIteration: '2016-10-10 12:22',
                payload: { a: 1 },
            })
            const r2 = await pg.query('select * from fetchq__foo__documents;')
            const inputDate = moment('2016-10-10 12:22')
            const docDate = moment(r2.rows[0]['next_iteration'])
            expect(r1.body.queued_docs).to.equal(1)
            expect(inputDate.format('MMMMDoYYYYmmss')).to.equal(docDate.format('MMMMDoYYYYmmss'))
        })

        it('should queue multiple documents with a specific date', async function () {
            const r1 = await request.post(url('/v1/queue/foo')).send({
                version: 0,
                nextIteration: '2016-10-10 12:22',
                docs: [
                    [ 'a1', 0, weirdPayload ],
                    [ 'a2', 0, weirdPayload ],
                ],
            })
            const r2 = await pg.query('select * from fetchq__foo__documents;')
            const inputDate = moment('2016-10-10 12:22')
            const docDate = moment(r2.rows[0]['next_iteration'])
            expect(r1.body.queued_docs).to.equal(2)
            expect(inputDate.format('MMMMDoYYYYmmss')).to.equal(docDate.format('MMMMDoYYYYmmss'))
        })
    })

})
