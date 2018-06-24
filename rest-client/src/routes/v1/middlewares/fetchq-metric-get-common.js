
const winston = require('winston')

const fetchqMetricGetCommon = () => async (req, res, next) => {
    try {
        const info = req.body.queue
            ? await req.fetchq.metricGetCommon(req.body.queue)
            : await req.fetchq.metricGetAll()
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/metric/get/common - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMetricGetCommon,
}
