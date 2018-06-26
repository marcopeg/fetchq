
const winston = require('winston')

const fetchqDocPick = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.doc.pick(req.body.queue, req.body.version, req.body.limit, req.body.duration)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/pick - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocPick,
}
