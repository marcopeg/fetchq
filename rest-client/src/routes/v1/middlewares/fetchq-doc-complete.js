
const winston = require('winston')

const fetchqDocComplete = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.docComplete(req.body.queue, req.body.documentId, req.body.payload)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/complete - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocComplete,
}
