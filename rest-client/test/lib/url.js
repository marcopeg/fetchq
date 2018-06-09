
const rootUrl = process.env.ROOT_URL || 'http://localhost:8080'

module.exports = url => `${rootUrl}${url}`
