
const winston = require('winston')

const fetchqPush = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.push(req.params.name, req.body)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/q/${req.params.name} - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqPush,
}
