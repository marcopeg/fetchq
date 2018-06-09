const winston = require('winston')
const express = require('express')
const compression = require('compression')

const { errorHandler } = require('../middlewares/error-handler')
const { createAppRouter } = require('../routes')

const app = express()

/**
 * Settings:
 * ssrEnabled: (string)[yes|no]
 * ssrTimeout: (int) - rendering timeout in milliseconds
 */
const init = (settings = {}) => {
    app.use(compression())

    app.use(createAppRouter(settings))
    app.use(errorHandler)
    
}

/**
 * Settings
 * -  port: (string) - server port
 */
const start = ({ port }) => {
    app.listen(port, () => winston.info(`[ssr] server running on ${port}`))
}

module.exports = {
    init,
    start,
}
