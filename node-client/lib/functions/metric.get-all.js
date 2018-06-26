
const createMetricGetAll = (ctx) => async () => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_get_all()',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.getAll() - ${err.message}`)
    }
}

module.exports = {
    createMetricGetAll,
}
