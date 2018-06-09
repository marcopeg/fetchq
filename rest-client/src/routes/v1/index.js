const express = require('express')
const { fetchqGetClient } = require('./middlewares/fetchq-get-client')
const { fetchqInit } = require('./middlewares/fetchq-init')
const { fetchqInfo } = require('./middlewares/fetchq-info')
const { fetchqCreateQueue } = require('./middlewares/fetchq-create-queue')
const { fetchqDropQueue } = require('./middlewares/fetchq-drop-queue')

const createV1Router = (settings) => {
    const router = express.Router()

    router.use(fetchqGetClient())

    router.get('/init', fetchqInit())
    router.get('/info', fetchqInfo())
    router.post('/q', fetchqCreateQueue())
    router.delete('/q/:name', fetchqDropQueue())

    return router
}

module.exports = {
    createV1Router,
}
