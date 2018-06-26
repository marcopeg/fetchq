
const createMetricCompute = (ctx) => async (queue) => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_compute(',
            `'${queue}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.compute() - ${err.message}`)
    }
}

module.exports = {
    createMetricCompute,
}
