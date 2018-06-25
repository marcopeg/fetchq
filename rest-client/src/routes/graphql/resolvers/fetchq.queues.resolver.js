
const fetchq = require('../../../services/fetchq')


const createFetchqQueuesResolver = () => async (params, args, root) => {
    const client = fetchq.getClient()
    const attributes = root.fieldNodes[0].selectionSet.selections.map(selection => selection.name.value)
    const result = await client.listQueues({ ...params, attributes })
    return result
}

module.exports = {
    createFetchqQueuesResolver,
}
