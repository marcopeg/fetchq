
const winston = require('winston')

const fetchqMntRun = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.mntRun(req.body.queue, req.body.limit)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/mnt/run - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMntRun,
}
