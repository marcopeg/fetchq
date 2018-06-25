
const {
    fetchqQueuesResolver,
    fetchqQueueResolver,
    createQueueResolver,
    dropQueueResolver,
} = require('./resolvers/fetchq.queues.resolver')

const createResolver = () => ({
    // FetchQ - queues
    queues: fetchqQueuesResolver(),
    queue: fetchqQueueResolver(),
    createQueue: createQueueResolver(),
    dropQueue: dropQueueResolver(),
})

module.exports = {
    createResolver,
}
