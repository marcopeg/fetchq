const winston = require('winston')
const moment = require('moment')
const { Fetchq } = require('../node-client/lib/fetchq.class') // @TODO: will become an npm module
const { WorkersPool } = require('../node-client/lib/workers-pool.class') // @TODO: will become an npm module
const config = require('@marcopeg/utils/lib/config')
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
    const workers = new WorkersPool({
        client
    })

    // connect the client and start the maintenance job
    await client.connect()
    await client.mnt.start()
    await workers.start()

    // just put some stuff in the database
    // await client.init()
    // await client.queue.create('foo')
    // await client.doc.push('foo', {
    //     subject: 'a1',
    //     payload: { runs: 0 },
    // })

    // register a worker for the foo queue
    workers.register({
        queue: 'foo',
        version: 0,
        handler: async (doc) => {
            console.log(`RUN WORKER `, doc)

            if (doc.subject === 'a2') {
                return {
                    action: 'reject',
                    message: 'I do not like a2',
                    details: { foo: 123 },
                    refId: 'xxx',
                }
            }

            if (doc.subject === 'a3') {
                return {
                    action: 'kill',
                    payload: {
                        ...doc.payload,
                        killed: true,
                    },
                }
            }

            if (doc.subject === 'a4') {
                return {
                    action: 'complete',
                    payload: {
                        ...doc.payload,
                        completed: true,
                    },
                }
            }
            
            if (doc.subject === 'a5') {
                return {
                    action: 'drop',
                }
            }

            if (doc.subject === 'a6') {
                return {
                    action: 'XXX-NOT-IMPLEMENTED-XXX',
                }
            }

            return {
                action: 'reschedule',
                nextIteration: moment().add(1, 'second').format('YYYY-MM-DD HH:mm Z'),
                payload: {
                    ...doc.payload,
                    runs: (doc.payload.runs || 0) + 1,
                },
            }
        }
    })
    
}

boot()
