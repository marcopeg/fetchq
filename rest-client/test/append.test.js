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

describe('FetchQ append()', function () {
    this.timeout(10000)

    beforeEach(async function () {
        await pg.reset()
        await pg.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        await request.post(url('/v1/queue')).send({
            name: 'foo',
        })
    })
    afterEach(async function () {
        await pg.query('DROP EXTENSION IF EXISTS "uuid-ossp";')
    })

    describe('single document', function () {
        it('should append a single document document', async function () {
            const res = await request.post(url('/v1/queue/foo/append')).send({
                version: 0,
                priority: 0,
                payload: weirdPayload,
            })
            
            expect(res.body.subject.length).to.be.above(30)
        })
    })
})
