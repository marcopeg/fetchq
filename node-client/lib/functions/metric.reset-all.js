
const createMetricResetAll = (ctx) => async () => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_reset_all()',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.resetAll() - ${err.message}`)
    }
}

module.exports = {
    createMetricResetAll,
}
