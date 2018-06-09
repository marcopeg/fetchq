
const { getClient } = require('../../../services/fetchq')

const fetchqGetClient = () => (req, res, next) => {
    req.fetchq = getClient()
    next()
}

module.exports = {
    fetchqGetClient,
}
