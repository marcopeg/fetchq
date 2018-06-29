const createDisconnect = (ctx) => async () => {
    try {
        const res = await ctx.pool.end()
        ctx.logger.verbose('[fetchq] connection ended')
    } catch (err) {
        ctx.logger.error(`[fetchq] ${err.message}`)
        ctx.logger.debug(err)
        throw new Error(`[fetchq] disconnect() - ${err.message}`)
    }
}

module.exports = {
    createDisconnect,
}
