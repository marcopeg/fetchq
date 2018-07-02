// @TODO: validate queue name
// @TODO: validate queue subject
// @TODO: validate queue version
// @TODO: validate queue priority
// @TODO: validate queue nextIteration
// @TODO: validate queue payload
const createDocAppend = (ctx) => async (queue, doc = {}, options = {}) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_append(',
            `'${queue}',`,
            `'${JSON.stringify(doc || {}).replace(/'/g, '\'\'\'\'')}', `,
            `${options.version || 0},`,
            `${options.priority || 0}`,
            ')'
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.append() - ${err.message}`)
    }
}

module.exports = {
    createDocAppend,
}
