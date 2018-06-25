
const fetchq = require('../../../services/fetchq')

const fetchqQueuesResolver = () => async (params, args, root) => {
    const attributes = root.fieldNodes[0].selectionSet.selections.map(selection => selection.name.value)
    const client = fetchq.getClient()
    const result = await client.listQueues({ ...params, attributes })
    return result
}

const createQueueResolver = () => async (params, args, root) => {
    const client = fetchq.getClient()
    const res = await client.createQueue(params.name)
    return res
}

const dropQueueResolver = () => async (params, args, root) => {
    const client = fetchq.getClient()
    const queue = await client.getQueue(params.name, { attributes: ['id'] })
    return {
        ...await client.dropQueue(params.name),
        queue_id: queue.id,
    }
}

module.exports = {
    fetchqQueuesResolver,
    createQueueResolver,
    dropQueueResolver,
}
