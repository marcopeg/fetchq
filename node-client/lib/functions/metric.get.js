
const createMetricGet = (ctx) => async (queue, metric = null) => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_get(',
            `'${queue}'`,
            metric ? `, '${metric}'` : '',
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return metric ? res.rows[0] : res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.get() - ${err.message}`)
    }
}

module.exports = {
    createMetricGet,
}
