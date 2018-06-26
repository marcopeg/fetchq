
const winston = require('winston')

const fetchqDocReschedule = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.doc.reschedule(req.body.queue, req.body.subject, req.body.nextIteration, req.body.payload)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/reschedule - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocReschedule,
}
