
const createDocDrop = (ctx) => async (queue = null, subject) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_drop(',
            `'${queue}',`,
            `'${subject}'`,
            ')',
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.drop() - ${err.message}`)
    }
}

module.exports = {
    createDocDrop,
}
