const moment = require('moment')
const config = require('@marcopeg/utils/lib/config')
const { Fetchq } = require('fetchq/lib/fetchq.class')

const worker = require('./worker')

const boot = async () => {
    
    /**
     * Setup the client
     */

    // create the instance with the connection's info
    const client = new Fetchq({
        logLevel: config.get('LOG_LEVEL', 'verbose'),
        connect: {
            user: config.get('POSTGRES_USER', 'fetchq'),
            password: config.get('POSTGRES_PASSWORD', 'fetchq'),
            database: config.get('POSTGRES_DATABASE', 'fetchq'),
            host: config.get('POSTGRES_HOST', 'localhost'),
            post: config.get('POSTGRES_PORT', '5432'),
        }
    })

    // register the workers that you plan to execute
    // (open `./worker.js` to see what a simple worker looks like)
    client.workers.register(worker)
    

    /**
     * Connect to Postgres
     */
    try {
        await client.connect()
    } catch (err) {
        throw new Error('FetchQ can not connect to the database')
    }
    

    /**
     * Auto initialization test
     * (you normally initialize Fetchq only once and you do it manually)
     */
    try {
        const info = await client.info()
        console.log(`FetchQ v${info.version} is ready to start`)
    } catch (err) {
        console.log('FetchQ needs to be initialized')
        await client.init()
    }


    /**
     * Start the daemons that will take care of the queue
     * 
     */
    try {
        await client.mnt.start()
        await client.workers.start()
    } catch (err) {
        console.log('FetchQ Startup Error:')
        console.log(err.message)
    }


    /**
     * Upsert a queue and push some demo documents
     */
    try {
        await client.queue.create('foo')

        // push a single document
        await client.doc.push('foo', {
            subject: 'a1',
            payload: {
                runs: 0,
                myData: true,
            },
            nextIteration: moment().add(1, 'second').format('YYYY-MM-DD HH:mm Z')
        })

        // push multiple documents
        await client.doc.pushMany('foo', {
            nextIteration: moment().add(1, 'second').format('YYYY-MM-DD HH:mm Z'),
            docs: [
                ['a2', 1, {}],
                ['a3', 2, {}],
                ['a4', 3, {}],
                ['a5', 4, {}],
                ['a6', 5, {}],
            ]
        })
    } catch (err) {
        console.log('FetchQ example queue setup error:')
        console.log(err.message)
    }
}

boot()
