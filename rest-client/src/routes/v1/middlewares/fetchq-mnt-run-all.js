
const winston = require('winston')

const fetchqMntRunAll = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.mnt.runAll(req.body.limit)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/mnt/run/all - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMntRunAll,
}
