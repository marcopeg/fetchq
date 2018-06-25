
const fetchq = require('../../../services/fetchq')


const fetchqQueuesResolver = () => async (params, args, root) => {
    const attributes = root.fieldNodes[0].selectionSet.selections.map(selection => selection.name.value)
    const client = fetchq.getClient()
    const result = await client.listQueues({ ...params, attributes })
    return result
}

const createQueueResolver = () => async (params, args, root) => {
    const attributes = root.fieldNodes[0].selectionSet.selections.map(selection => selection.name.value)
        .filter(i => i !== 'was_created')
    const client = fetchq.getClient()
    const res = await client.createQueue(params.name)
    const queue = await client.getQueue(res.queue_id, { attributes })
    console.log('create queue', params, res)
    return {
        ...queue,
        was_created: res.was_created,
    }
}

module.exports = {
    fetchqQueuesResolver,
    createQueueResolver,
}
