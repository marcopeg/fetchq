
const createDocReschedule = (ctx) => async (queue = null, documentId = 0, nextIteration = null, payload = null) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_reschedule(',
            `'${queue}',`,
            `${documentId},`,
            nextIteration === null ? 'NOW()' : `'${nextIteration}'`,
            payload === null ? '' : `, '${JSON.stringify(payload || {}).replace(/'/g, '\'\'\'\'')}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.reschedule() - ${err.message}`)
    }
}

module.exports = {
    createDocReschedule,
}
