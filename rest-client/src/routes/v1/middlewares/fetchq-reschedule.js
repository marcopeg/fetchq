
const winston = require('winston')

const fetchqReschedule = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.reschedule(req.body.queue, req.body.documentId, req.body.nextIteration, req.body.payload)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/reschedule - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqReschedule,
}
