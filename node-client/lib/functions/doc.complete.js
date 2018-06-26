
const createDocComplete = (ctx) => async (queue = null, documentId = 0, payload = null) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_complete(',
            `'${queue}',`,
            `${documentId},`,
            `'${JSON.stringify(payload || {}).replace(/'/g, '\'\'\'\'')}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.complete() - ${err.message}`)
    }
}

module.exports = {
    createDocComplete,
}
