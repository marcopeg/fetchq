
const winston = require('winston')

const fetchqDocDrop = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.doc.drop(req.body.queue, req.body.documentId)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/drop - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocDrop,
}
