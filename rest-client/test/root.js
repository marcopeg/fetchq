const expect = require('chai').expect
const request = require('superagent')
const url = require('./lib/url')

describe('FetchQ Rest Client', function () {
    it('should work', async function () {
        const res = await request.get(url('/'))
        expect(res.statusCode).to.equal(200)
    })
})
