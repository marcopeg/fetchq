const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')
const pg = require('./lib/pg')

describe('FetchQ init', function () {
    beforeEach(async function () {
        await pg.reset()
    })

    it('should initialize a virgin database', async function () {
        await pg.dropSchema()
        const res = await request.get(url('/v1/init'))
        expect(res.statusCode).to.equal(200)
        expect(res.body.was_initialized).to.equal(true)
    })

    it('should not initialize an existing database', async function () {
        const res = await request.get(url('/v1/init'))
        expect(res.statusCode).to.equal(200)
        expect(res.body.was_initialized).to.equal(false)
    })
})