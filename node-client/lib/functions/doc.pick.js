
const createDocPick = (ctx) => async (queue = null, version = 0, limit = 1, duration = '5m') => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_pick(',
            `'${queue}',`,
            `${version},`,
            `${limit},`,
            `'${duration}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc-pick() - ${err.message}`)
    }
}

module.exports = {
    createDocPick,
}
