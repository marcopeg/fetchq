const express = require('express')
const { fetchqGetClient } = require('./middlewares/fetchq-get-client')
const { fetchqInfo } = require('./middlewares/fetchq-info')

const createV1Router = (settings) => {
    const router = express.Router()

    router.use(fetchqGetClient())

    router.get('/info', fetchqInfo())

    return router
}

module.exports = {
    createV1Router,
}
