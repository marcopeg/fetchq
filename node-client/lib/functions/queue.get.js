
const createQueueGet = (ctx) => async (name, settings = {}) => {
    try {
        const q = [
            'SELECT ',
            settings.attributes
                ? `${settings.attributes.join(', ')} `
                : '* ',
            'FROM fetchq_sys_queues ',
            `WHERE name = '${name}' `,
        ].join('')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] queue.get() - ${err.message}`)
    }
}

module.exports = {
    createQueueGet,
}
