const winston = require('winston')

const fetchqInfo = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.info()
        res.send(info)
    } catch (err) {
        winston.verbose(`/api/v1/info - ${err.message}`)
        winston.debug(err)
        next([ 412, 'FetchqDB might need to be initialized', {
            details: 'Try to run: `/api/v1/init`',
        } ])
    }
}

module.exports = {
    fetchqInfo,
}
