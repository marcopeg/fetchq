
const createConnect = (ctx) => async () => {
    try {
        const res = await ctx.pool.query('SELECT NOW()')
        ctx.logger.verbose(`[fetchq] now is: ${res.rows[0].now}`)
    } catch (err) {
        ctx.logger.error(`[fetchq] ${err.message}`)
        ctx.logger.debug(err)
        throw new Error('[fetchq] Could not connect to Postgres')
    }
}

module.exports = {
    createConnect,
}
