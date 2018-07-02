const moment = require('moment')

module.exports = {
    queue: 'faa',
    version: 0,

    // how many parallel worker instances to run
    concurrency: 10,

    // how many documents to fetch in advance
    batch: 40,

    // delay in between of each document
    delay: 1,

    // delay to apply if there are no documents to work out
    sleep: 5000,

    // worker function - what to do with the document
    handler: async (doc, { worker }) => {
        console.log(`${worker.id} :: ${doc.subject}`)
        return { action: 'complete' }
    }
}
