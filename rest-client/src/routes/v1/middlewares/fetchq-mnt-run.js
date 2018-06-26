
const winston = require('winston')

const fetchqMntRun = () => async (req, res, next) => {
    try {
        const info = req.body.queue
            ? await req.fetchq.mnt.run(req.body.queue, req.body.limit)
            : await req.fetchq.mnt.runAll(req.body.limit)
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
