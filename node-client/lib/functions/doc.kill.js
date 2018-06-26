
const createDocKill = (ctx) => async (queue = null, subject, payload = null) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_kill(',
            `'${queue}',`,
            `'${subject}',`,
            `'${JSON.stringify(payload || {}).replace(/'/g, '\'\'\'\'')}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.kill() - ${err.message}`)
    }
}

module.exports = {
    createDocKill,
}
