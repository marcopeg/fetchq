
const winston = require('winston')

const fetchqKill = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.kill(req.body.queue, req.body.documentId, req.body.payload)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/kill - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqKill,
}
