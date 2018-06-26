
const createInit = (ctx) => async () => {
    try {
        await ctx.pool.query('CREATE EXTENSION IF NOT EXISTS fetchq;')
        const res = await ctx.pool.query('SELECT * FROM fetchq_init()')
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] init() - ${err.message}`)
    }
}

module.exports = {
    createInit,
}
