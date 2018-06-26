
const winston = require('winston')

const fetchqQueueCreate = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.queueCreate(req.body.name)
        res.send(info)
    } catch (err) {
        winston.verbose(`/api/v1/q - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqQueueCreate,
}
