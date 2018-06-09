
const requestData = () => (req, res, next) => {
    if (!req.data) {
        req.data = {}
    }
    next()
}

module.exports = {
    requestData,
}
