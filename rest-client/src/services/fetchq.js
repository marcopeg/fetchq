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
        await client.mnt.start()
    } catch (err) {
        winston.error(`[fetchq] ${err.message}`)
        throw new Error('Could not run the maintenance daemon')
    }
}

const stop = async () => {
    // stop maintenance daemon
    try {
        await client.mnt.stop()
    } catch (err) {
        winston.error(`[fetchq] ${err.message}`)
        throw new Error('Could not stop the maintenance daemon')
    }

    // stop db connection
    try {
        await client.disconnect()
    } catch (err) {
        winston.error(`[fetchq] ${err.message}`)
        throw new Error('Could not terminate the connection with the database')
    }
}

const getClient = () => client
    
module.exports = {
    init,
    start,
    stop,
    getClient,
}