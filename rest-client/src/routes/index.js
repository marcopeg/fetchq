const express = require('express')
const { createV1Router } = require('./v1')
const { createGraphqlRouter } = require('./graphql')
const bodyParser = require('body-parser')
const { requestData } = require('../middlewares/request-data')

const createAppRouter = (settings) => {
    const router = express.Router()

    router.use(bodyParser.json({ limit: '1mb' }))
    router.use(requestData())

    router.use('/v1', createV1Router())
    router.use('/graphql', createGraphqlRouter())
    router.get('/', (req, res) => res.send('fetchq rest client'))

    return router
}

module.exports = {
    createAppRouter,
}
