const moment = require('moment')

module.exports = {
    queue: 'faa',
    version: 0,

    // how long to reserve a document for execution
    // (default: 5m) - see Postgres INTERVAL format
    // http://www.postgresqltutorial.com/postgresql-interval/
    lock: '1m',

    // how many parallel worker instances to run
    // (default: 1)
    concurrency: 4,

    // how many documents to fetch in advance
    // (default: 1)
    batch: 40,

    // delay in between of each document
    // (default: 0ms)
    delay: 500,

    // delay to apply if there are no documents to work out
    sleep: 5000,

    // worker function - what to do with the document
    handler: async (doc, { worker }) => {
        console.log(`${worker.id} :: ${doc.subject}`)
        return { action: 'complete' }
    }
}
