
const config = require('@marcopeg/utils/lib/config')

// Connected as Docker volume by `docker-compose.yml`
// (will become an npm module)
const fetchq = require('../../node-client')

const boot = async () => {
    
    /**
     * Setup the client
     */
    const client = fetchq({
        // set maintenance daemon properties
        maintenance: {
            limit: 1,       // how many jobs to run in one single server call?
            delay: 250,     // how long to wait in between of successfull executions?
            sleep: 5000,    // how long to wait if there is no further maintenance planned?
        },

        // register all the workers you want to run
        workers: [
            require('./worker.foo'),
            require('./worker.faa'),
        ],
    })

    /**
     * Connect to the Database
     */
    try {
        await client.start()
    } catch (err) {
        cliet.logger.verbose(`FetchQ could not connect to Postgres - ${err.message}`)
        return
    }



    /**
     * Auto initialization test
     * (you normally initialize Fetchq only once and you do it manually)
     */
    
    try {
        const info = await client.info()
        cliet.logger.verbose(`FetchQ v${info.version} is ready to start`)
    } catch (err) {
        cliet.logger.verbose(`FetchQ needs to be initialized - ${err.message}`)
        await client.init()
        await client.pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    }



    /**
     * Upsert a queue and push some demo documents
     * (optional step, just to make the demo running)
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
            // version: 0,
            // nextIteration: moment().add(1, 'second').format('YYYY-MM-DD HH:mm Z')
        })

        // push multiple documents
        await client.doc.pushMany('foo', {
            // version: 0,
            // nextIteration: moment().add(1, 'second').format('YYYY-MM-DD HH:mm Z'),
            // each doc has: 0=subjec, 1=priority, 2=payload
            docs: [
                ['a2', 1, {}],
                ['a3', 2, {}],
                ['a4', 3, {}],
                ['a5', 4, {}],
                ['a6', 5, {}],
            ]
        })

        // push a huge amount of documents into queue "faa"
        await client.queue.create('faa')
        // const docs = []
        for (let i = 0; i < 10; i++) {
            const ps = []
            for (let j = 0; j < 100; j++) {
                const p = client.doc.append('faa', { payload: { i } })
                ps.push(p)
            }
            await Promise.all(ps)
            // const r = await client.doc.append('faa', {
            //     payload: { i },
            // })
            // docs.push([`a${i}`, 0, {}])
        }
        // await client.doc.pushMany('faa', { docs })
    } catch (err) {
        cliet.logger.verbose(`FetchQ example queue setup error: ${err.message}`)
    }

}

boot()
