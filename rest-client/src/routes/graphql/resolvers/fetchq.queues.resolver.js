
const fetchq = require('../../../services/fetchq')


/*
query GetQueues {
  queues (
    sortBy:"created_at"
    sortOrder: DESC
  ) {
    id
    name
    current_version
  }
}
*/
const fetchqQueuesResolver = () => async (params, args, root) => {
    const attributes = root.fieldNodes
        .find(i => i.name.value === root.fieldName)
        .selectionSet.selections.map(selection => selection.name.value)
    const client = fetchq.getClient()
    return await client.listQueues({ ...params, attributes })
}

/*
query GetQueue {
  queue(name: "faa") {
    id
    name
    current_version
  }
}
*/
const fetchqQueueResolver = () => async (params, args, root) => {
    const attributes = root.fieldNodes
        .find(i => i.name.value === root.fieldName)
        .selectionSet.selections.map(selection => selection.name.value)
    const client = fetchq.getClient()
    return await client.getQueue(params.name, { attributes })
}

/*
mutation CreateQueue {
  createQueue(
    name: "fai"
  ) {
    queue_id
    was_created
  }
}
*/
const createQueueResolver = () => async (params, args, root) => {
    console.log(root.fieldNodes)
    const client = fetchq.getClient()
    const res = await client.createQueue(params.name)
    const queue = await client.getQueue(params.name)
    return {
        ...res,
        queue,
    }
}

/*
mutation DropQueue {
  dropQueue(
    name:"fai"
  ) {
    was_dropped
  }
}
*/
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
    fetchqQueueResolver,
    createQueueResolver,
    dropQueueResolver,
}
