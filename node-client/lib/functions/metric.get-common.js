
const createMetricGetCommon = (ctx) => async (queue) => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_get_common(',
            `'${queue}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.getCommon() - ${err.message}`)
    }
}

module.exports = {
    createMetricGetCommon,
}
