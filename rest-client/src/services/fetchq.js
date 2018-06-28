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
        winston.error(`[fetchq] ${err.message}`)
        throw new Error('Could not connect to FetchqDB')
    }

    try {
        await client.startMaintenance()
    } catch (err) {
        winston.error(`[fetchq] ${err.message}`)
        throw new Error('Could not run the maintenance daemon')
    }
}

const getClient = () => client
    
module.exports = {
    init,
    start,
    getClient,
}