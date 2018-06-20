
const winston = require('winston')

const fetchqPick = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.pick(req.body.queue, req.body.version, req.body.limit, req.body.duration)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/pick - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqPick,
}
