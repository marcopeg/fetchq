const moment = require('moment')

module.exports = {
    queue: 'faa',
    version: 0,
    concurrency: 2,
    batch: 40,
    delay: 1,
    handler: async (doc, {
        worker
    }) => {
        console.log(`RUN WORKER ${worker.id}`, doc)
        return { action: 'complete' }
    }
}
