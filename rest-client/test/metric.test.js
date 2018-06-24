const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')


describe.only('FetchQ Metrics', function () {
    beforeEach(async function () {
        await pg.reset()

        // queue: foo
        await request.post(url('/v1/q')).send({ name: 'foo' })
        await request.post(url('/v1/q/foo')).send({ subject: 'a3' })
        
        // queue: faa
        await request.post(url('/v1/q')).send({ name: 'faa' })
        await request.post(url('/v1/q/faa')).send({ subject: 'a3' })
        await request.post(url('/v1/pick')).send({ queue: 'faa', duration: '1s' })

        await request.post(url('/v1/mnt/run/all'))
        await request.post(url('/v1/metric/log/pack'))
    })

    it('should get a specific metric value', async function () {
        const r1 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
            metric: 'cnt',
        })
        expect(r1.body.current_value).to.equal(1)
    })

    it('should get all the available metrics for a specific queue', async function () {
        const r1 = await request.post(url('/v1/metric/get')).send({
            queue: 'foo',
        })
        expect(r1.body.length).to.at.least(1)
    })

    it('should get the total of a specific metric across all queues', async function () {
        const r1 = await request.post(url('/v1/metric/get/total')).send({
            metric: 'cnt',
        })
        expect(r1.body.current_value).to.equal(2)
    })

})
