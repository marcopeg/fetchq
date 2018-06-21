
const winston = require('winston')

const fetchqComplete = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.complete(req.body.queue, req.body.documentId, req.body.payload)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/complete - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqComplete,
}
