
const createMetricGetTotal = (ctx) => async (metric) => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_get_total(',
            `'${metric}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.getTotal() - ${err.message}`)
    }
}

module.exports = {
    createMetricGetTotal,
}
