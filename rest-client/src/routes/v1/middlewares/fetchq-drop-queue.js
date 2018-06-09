
const winston = require('winston')

const fetchqDropQueue = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.dropQueue(req.params.name)
        res.send(info)
    } catch (err) {
        winston.verbose(`/api/v1/q/${req.params.name} - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDropQueue,
}
