const winston = require('winston')
const { Fetchq } = require('../../../node-client/lib/fetchq.class') // @TODO: will become an npm module

let client = null

const init = (config = {}) => {
    client = new Fetchq(config)
}

const start = async () => {
    try {
        await client.connect()
    } catch (err) {
        winston.error(`[fetch1] ${err.message}`)
        throw new Error('Could not connect to FetchqDB')
    }
}

const getClient = () => client
    
module.exports = {
    init,
    start,
    getClient,
}