
const winston = require('winston')

const fetchqMetricCompute = () => async (req, res, next) => {
    try {
        const info = req.body.queue
            ? await req.fetchq.metricCompute(req.body.queue)
            : await req.fetchq.metricComputeAll()
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/metric/compute - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMetricCompute,
}
