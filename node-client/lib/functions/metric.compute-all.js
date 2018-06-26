
const createMetricComputeAll = (ctx) => async () => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_compute_all()',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.computeAll() - ${err.message}`)
    }
}

module.exports = {
    createMetricComputeAll,
}
