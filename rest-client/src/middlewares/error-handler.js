
const errorHandler = (err, req, res, next) => {
    // error as a string
    if (typeof err === 'string') {
        res.status(500).send(err)
        return
    }

    // [ 400, 'error message' ]
    if (Array.isArray(err) && err.length > 1) {
        res.statusMessage = err[1]
        res.status(err[0]).send(err[2] || err[1])
        return
    }

    // Object form
    if (err.status) {
        res.status(err.status)
    } else {
        res.status(500)
    }

    if (err.statusText) {
        res.statusMessage = err.statusText
        res.send(err.statusText)
    } else if (err.message) {
        res.statusMessage = err.message
        res.send(err.message)
    } else if (err.msg) {
        res.statusMessage = err.msg
        res.send(err.msg)
    } else {
        res.send(err)
    }
}

module.exports = {
    errorHandler,
}
