
const winston = require('winston')

const fetchqMetricReset = () => async (req, res, next) => {
    try {
        const info = req.body.queue
            ? await req.fetchq.metricReset(req.body.queue)
            : await req.fetchq.metricResetAll()
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/metric/reset - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMetricReset,
}
