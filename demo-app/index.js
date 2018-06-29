const winston = require('winston')
const { Fetchq } = require('../node-client/lib/fetchq.class') // @TODO: will become an npm module
const config = require('@marcopeg/utils/lib/config')
winston.level = process.env.LOG_LEVEL || 'verbose'

const boot = async () => {
    client = new Fetchq({
        logLevel: winston.level,
        connect: {
            user: config.get('PGUSER', 'fetchq'),
            password: config.get('PGPASSWORD', 'fetchq'),
            database: config.get('PGDATABASE', 'fetchq'),
            host: config.get('PGHOST', 'localhost'),
            post: config.get('PGPORT', '5432'),
        }
    })

    await client.connect()
    await client.startMaintenance()
    console.log(await client.init())
    console.log(await client.queue.create('foo'))
    
}

boot()
