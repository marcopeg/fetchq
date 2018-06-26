
const createQueueList = (ctx) => async (settings = {}) => {
    try {
        const q = [
            'SELECT ',
            settings.attributes
                ? `${settings.attributes.join(', ')} `
                : '* ',
            'FROM fetchq_sys_queues ORDER BY ',
            settings.sortBy
                ? `${settings.sortBy } `
                : 'name ',
                settings.sortOrder
                ? `${settings.sortOrder } `
                : 'ASC ',
        ].join('')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] queue.list() - ${err.message}`)
    }
}

module.exports = {
    createQueueList,
}
