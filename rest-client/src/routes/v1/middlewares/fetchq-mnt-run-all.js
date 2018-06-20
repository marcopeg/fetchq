
const winston = require('winston')

const fetchqMntRunAll = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.mntRunAll(req.body.limit)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/pick - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqMntRunAll,
}
