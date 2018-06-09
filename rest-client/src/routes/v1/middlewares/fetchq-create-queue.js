
const winston = require('winston')

const fetchqCreateQueue = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.createQueue(req.body.name)
        res.send(info)
    } catch (err) {
        winston.verbose(`/api/v1/q - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqCreateQueue,
}
