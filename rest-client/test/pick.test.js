const moment = require('moment')
const expect = require('chai').expect
const request = require('superagent')
const pause = require('@marcopeg/utils/lib/pause')
const url = require('./lib/url')
const pg = require('./lib/pg')


describe('FetchQ pick', function () {
    this.timeout(10000)
    
    beforeEach(async function () {
        await pg.reset()
        await request.post(url('/v1/queue')).send({ name: 'foo' })
        await request.post(url('/v1/queue/foo')).send({
            subject: 'a3',
            version: 0,
            priority: 0,
            nextIteration: moment().add(1, 'year'),
            payload: { a: 3 },
        })
        await request.post(url('/v1/queue/foo')).send({
            subject: 'a2',
            version: 0,
            priority: 0,
            // forcefully in the past
            nextIteration: moment().subtract(1, 'second'),
            payload: { a: 2 },
        })
        await request.post(url('/v1/queue/foo')).send({
            subject: 'a1',
            version: 0,
            priority: 0,
            nextIteration: moment().subtract(1, 'year'),
            payload: { a: 1 },
        })
        await request.post(url('/v1/metric/log/pack')).send()
    })

    it('should pick a scheduled document', async function () {
        const docs = (await request.post(url('/v1/pick')).send({
            queue: 'foo',
        })).body
        expect(docs.length).to.equal(1)
        expect(docs[0].subject).to.equal('a1')
    })

    it('should not pick the same document twice', async function () {
        const r1 = await request.post(url('/v1/pick')).send({ queue: 'foo' })
        const r2 = await request.post(url('/v1/pick')).send({ queue: 'foo' })
        expect(r2.body.length).to.equal(1)
        expect(r2.body[0].subject).to.equal('a2')
    })

    it('should establish a custom lock duration', async function () {
        await request.post(url('/v1/pick')).send({
            queue: 'foo',
            duration: '1 minute',
            limit: 1,
        })
        await request.post(url('/v1/pick')).send({
            queue: 'foo',
            duration: '1 millisecond',
            limit: 1,
        })
        await pause(1)
        await request.post(url('/v1/mnt/run'))
        const docs = (await request.post(url('/v1/pick')).send({
            queue: 'foo',
        })).body
        expect(docs.length).to.equal(1)
        expect(docs[0].subject).to.equal('a2')
    })

})
