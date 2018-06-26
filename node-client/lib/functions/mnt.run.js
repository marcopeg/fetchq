
const createMntRun = (ctx) => async (queue, limit = 100) => {
    try {
        const q = [
            'SELECT * FROM fetchq_mnt_run(',
            `'${queue}',`,
            limit,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] mnt.run() - ${err.message}`)
    }
}

module.exports = {
    createMntRun,
}
