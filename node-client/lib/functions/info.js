
const createInfo = (ctx) => async () => {
    try {
        const q = 'SELECT * FROM fetchq_info()'
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] info() - ${err.message}`)
    }
}

module.exports = {
    createInfo,
}
