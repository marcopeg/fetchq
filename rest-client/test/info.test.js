const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe('FetchQ info', function () {
    this.timeout(10000)
    
    beforeEach(async function () {
        await pg.reset()
    })

    it('should fetch info from an initialized instance', async function () {
        const res = await request.get(url('/v1/info'))
        expect(res.statusCode).to.equal(200)
        expect(res.body.version).to.equal('1.2.0')
    })

    it('should provide a 412 if the database is not initialized', async function () {
        await pg.dropSchema()
        try {
            await request.get(url('/v1/info'))
        } catch (err) {
            expect(err.response.statusCode).to.equal(412)
        }
    })
})
