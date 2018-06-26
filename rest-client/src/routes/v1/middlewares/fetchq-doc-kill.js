
const winston = require('winston')

const fetchqDocKill = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.doc.kill(req.body.queue, req.body.subject, req.body.payload)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/kill - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocKill,
}
