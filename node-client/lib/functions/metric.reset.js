
const createMetricReset = (ctx) => async (queue) => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_reset(',
            `'${queue}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.reset() - ${err.message}`)
    }
}

module.exports = {
    createMetricReset,
}
