
const winston = require('winston')

const fetchqMetricLogPack = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.metric.logPack()
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/metric/log/pack - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMetricLogPack,
}
