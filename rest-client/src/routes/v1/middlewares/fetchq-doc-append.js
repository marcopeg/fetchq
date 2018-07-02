const winston = require('winston')

const fetchqDocAppend = () => async (req, res, next) => {
    try {
        const info = await req.fetchq.doc.append(req.params.name, req.body.payload, req.body)
        
        // console.log(info)
        res.send(info)
    } catch (err) {
        winston.verbose(`post://api/v1/queue/${req.params.name}/append - ${err.message}`)
        winston.debug(err)
        next(err)
    }
}

module.exports = {
    fetchqDocAppend,
}
