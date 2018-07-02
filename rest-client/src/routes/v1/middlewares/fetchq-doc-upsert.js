const winston = require('winston')

const fetchqDocUpsert = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.doc.upsert(req.params.name, req.body)
        // console.log(info)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/queue/${req.params.name}/upsert - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocUpsert,
}
