const winston = require('winston')
const config = require('@marcopeg/utils/lib/config')

const { Fetchq } = require('../node-client/lib/fetchq.class') // @TODO: will become an npm module

// worker definition
const worker1 = require('./worker')

winston.level = process.env.LOG_LEVEL || 'verbose'

const boot = async () => {
    // setup the client connection
    const client = new Fetchq({
        logLevel: winston.level,
        connect: {
            user: config.get('PGUSER', 'fetchq'),
            password: config.get('PGPASSWORD', 'fetchq'),
            database: config.get('PGDATABASE', 'fetchq'),
            host: config.get('PGHOST', 'localhost'),
            post: config.get('PGPORT', '5432'),
        }
    })

    // Setup the workers pool that will execute the real code
    // const workers = new WorkersPool(client)

    // connect the client and start the maintenance job
    await client.connect()
    await client.mnt.start()
    await client.workers.start()

    // just put some stuff in the database
    // await client.init()
    // await client.queue.create('foo')
    // await client.doc.push('foo', {
    //     subject: 'a1',
    //     payload: { runs: 0 },
    // })

    // register a worker for the foo queue
    client.workers.register(worker1)
    
}

boot()
