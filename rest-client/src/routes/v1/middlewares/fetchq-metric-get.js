
const winston = require('winston')

const fetchqMetricGet = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.metricGet(req.body.queue, req.body.metric)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/metric/get - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMetricGet,
}
