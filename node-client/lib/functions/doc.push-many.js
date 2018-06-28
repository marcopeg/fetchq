
// @TODO: validate queue name
// @TODO: validate queue subject
// @TODO: validate queue version
// @TODO: validate queue priority
// @TODO: validate queue nextIteration
// @TODO: validate queue payload

/*
data.docs = [
    [ subject, version, payload ],
    [ 'a1', 0, { a: 1 } ],
    ...
]
*/
const createDocPushMany = (ctx) => async (queue, data = {}) => {
    try {
        const q = [
            'SELECT * FROM fetchq_doc_push(',
            `'${queue}',`,
            `${data.priority || 0},`,
            data.nextIteration ? `'${data.nextIteration}',` : 'NOW(),',
            '\'(',
            data.docs
                .map(doc => [
                    `''${doc[0]}''`,
                    `${doc[1] || 0}`,
                    `''${JSON.stringify(doc[2] || {}).replace(/'/g, '\'\'\'\'')}''`,
                    '{DATA}'
                ].join(', '))
                .join('), ('),
            ')\')'
        ].join(' ')
        // console.log(q)
        const res = await ctx.pool.query(q)
        return res.rows[0]
    } catch (err) {
        ctx.logger.debug(err)
        throw new Error(`[fetchq] doc.pushMany() - ${err.message}`)
    }
}

module.exports = {
    createDocPushMany,
}
