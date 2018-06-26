
const winston = require('winston')

const fetchqMetricGetTotal = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.metric.getTotal(req.body.metric)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/metric/get/total - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMetricGetTotal,
}
