
// @TODO: validate queue name
const createQueueDrop = (ctx) => async (name) => {
    try {
        const q = `SELECT * FROM fetchq_queue_drop('${name}')`
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] queue.drop() - ${err.message}`)
    }
}

module.exports = {
    createQueueDrop,
}
