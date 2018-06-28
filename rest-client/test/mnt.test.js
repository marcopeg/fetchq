const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')


describe('FetchQ Mnt', function () {
    this.timeout(10000)
    
    beforeEach(async function () {
        await pg.reset()

        // queue: foo
        await request.post(url('/v1/q')).send({ name: 'foo' })
        await request.post(url('/v1/q/foo')).send({ subject: 'a3' })
        await request.post(url('/v1/pick')).send({ queue: 'foo', duration: '1s' })
        await pg.query(`UPDATE fetchq__foo__documents SET next_iteration = NOW() - INTERVAL '1y'`)
        
        // queue: faa
        await request.post(url('/v1/q')).send({ name: 'faa' })
        await request.post(url('/v1/q/faa')).send({ subject: 'a3' })
        await request.post(url('/v1/pick')).send({ queue: 'faa', duration: '1s' })
        await pg.query(`UPDATE fetchq__faa__documents SET next_iteration = NOW() - INTERVAL '1y'`)
    })

    it('should run a queue maintenance', async function () {
        const r1 = await request.post(url('/v1/mnt/run')).send({
            queue: 'foo',
            limit: 1,
        })
        expect(r1.body).to.deep.equal({
            activated_count: 0,
            rescheduled_count: 1,
            killed_count: 0,
        })
    })

    it('should run ALL queue maintenance', async function () {
        const r1 = await request.post(url('/v1/mnt/run')).send({
            limit: 1,
        })
        expect(r1.body).to.deep.equal([ {
            queue: 'foo',
            activated_count: 0,
            rescheduled_count: 1,
            killed_count: 0,
        }, {
            queue: 'faa',
            activated_count: 0,
            rescheduled_count: 1,
            killed_count: 0,
        } ])
    })

})
