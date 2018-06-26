
const createDocReject = (ctx) => async (queue = null, subject, errorMsg = null, errorDetails = null, refId = null) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_reject(',
            `'${queue}',`,
            `'${subject}',`,
            `'${errorMsg || ''}',`,
            `'${JSON.stringify(errorDetails || {}).replace(/'/g, '\'\'\'\'')}'`,
            refId === null ? '' : `, '${refId}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.reject() - ${err.message}`)
    }
}

module.exports = {
    createDocReject,
}
