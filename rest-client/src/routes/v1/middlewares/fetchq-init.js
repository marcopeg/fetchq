const winston = require('winston')

const fetchqInit = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.init()
        res.send(info)
    } catch (err) {
        winston.verbose(`/api/v1/init - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqInit,
}
