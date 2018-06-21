const express = require('express')
const { fetchqGetClient } = require('./middlewares/fetchq-get-client')
const { fetchqInit } = require('./middlewares/fetchq-init')
const { fetchqInfo } = require('./middlewares/fetchq-info')
const { fetchqCreateQueue } = require('./middlewares/fetchq-create-queue')
const { fetchqDropQueue } = require('./middlewares/fetchq-drop-queue')
const { fetchqPush } = require('./middlewares/fetchq-push')
const { fetchqPick } = require('./middlewares/fetchq-pick')
const { fetchqReschedule } = require('./middlewares/fetchq-reschedule')
const { fetchqReject } = require('./middlewares/fetchq-reject')
const { fetchqComplete } = require('./middlewares/fetchq-complete')
const { fetchqKill } = require('./middlewares/fetchq-kill')
const { fetchqMetricLogPack } = require('./middlewares/fetchq-metric-log-pack')
const { fetchqMetricGet } = require('./middlewares/fetchq-metric-get')
const { fetchqMntRunAll } = require('./middlewares/fetchq-mnt-run-all')

const createV1Router = (settings) => {
    const router = express.Router()

    router.use(fetchqGetClient())

    router.get('/init', fetchqInit())
    router.get('/info', fetchqInfo())

    // queue api
    router.post('/q', fetchqCreateQueue())
    router.post('/q/:name', fetchqPush())
    router.delete('/q/:name', fetchqDropQueue())

    // document api
    router.post('/pick', fetchqPick())
    router.post('/reschedule', fetchqReschedule())
    router.post('/reject', fetchqReject())
    router.post('/complete', fetchqComplete())
    router.post('/kill', fetchqKill())

    // metrics
    router.post('/metric/log/pack', fetchqMetricLogPack())
    router.post('/metric/get', fetchqMetricGet())

    // maintenance
    router.post('/mnt/run/all', fetchqMntRunAll())

    return router
}

module.exports = {
    createV1Router,
}
