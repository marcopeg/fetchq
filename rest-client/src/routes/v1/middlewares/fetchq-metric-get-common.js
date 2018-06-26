
const winston = require('winston')

const fetchqMetricGetCommon = () => async (req, res, next) => {
    try {
        const info = req.body.queue
            ? await req.fetchq.metric.getCommon(req.body.queue)
            : await req.fetchq.metric.getAll()
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
