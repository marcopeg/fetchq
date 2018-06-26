
// @TODO: validate queue name
const createQueueCreate = (ctx) => async (name) => {
    try {
        const q = `SELECT * FROM fetchq_queue_create('${name}')`
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] queue.create() - ${err.message}`)
    }
}

module.exports = {
    createQueueCreate,
}
