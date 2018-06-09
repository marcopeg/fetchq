const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')

describe('FetchQ Rest Client', function () {
    it('should fetch info', async function () {
        const res = await request.get(url('/v1/info'))
        expect(res.statusCode).to.equal(200)
        expect(res.body.version).to.equal('0.0.1')
    })
})
