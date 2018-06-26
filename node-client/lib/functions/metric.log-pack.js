
const createMetricLogPack = (ctx) => async () => {
    try {
        const q = [
            'SELECT * FROM fetchq_metric_log_pack()',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] metric.logPack() - ${err.message}`)
    }
}

module.exports = {
    createMetricLogPack,
}
