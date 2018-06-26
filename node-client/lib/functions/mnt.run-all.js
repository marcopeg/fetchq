
const createMntRunAll = (ctx) => async (limit = 100) => {
    try {
        const q = [
            'SELECT * FROM fetchq_mnt_run_all(',
            limit,
            ')',
        ].join(' ')
        const res = await ctx.pool.query(q)
        return res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] mnt.runAll() - ${err.message}`)
    }
}

module.exports = {
    createMntRunAll,
}
