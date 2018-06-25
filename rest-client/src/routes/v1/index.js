const express = require('express')
const { fetchqGetClient } = require('./middlewares/fetchq-get-client')
const { fetchqInit } = require('./middlewares/fetchq-init')
const { fetchqInfo } = require('./middlewares/fetchq-info')
const { fetchqCreateQueue } = require('./middlewares/fetchq-create-queue')
const { fetchqDropQueue } = require('./middlewares/fetchq-drop-queue')
const { fetchqDocPush } = require('./middlewares/fetchq-doc-push')
const { fetchqDocPick } = require('./middlewares/fetchq-doc-pick')
const { fetchqDocReschedule } = require('./middlewares/fetchq-doc-reschedule')
const { fetchqReject } = require('./middlewares/fetchq-reject')
const { fetchqComplete } = require('./middlewares/fetchq-complete')
const { fetchqKill } = require('./middlewares/fetchq-kill')
const { fetchqDrop } = require('./middlewares/fetchq-drop')
const { fetchqMetricLogPack } = require('./middlewares/fetchq-metric-log-pack')
const { fetchqMetricGetTotal } = require('./middlewares/fetchq-metric-get-total')
const { fetchqMetricGetCommon } = require('./middlewares/fetchq-metric-get-common')
const { fetchqMetricGet } = require('./middlewares/fetchq-metric-get')
const { fetchqMetricCompute } = require('./middlewares/fetchq-metric-compute')
const { fetchqMetricReset } = require('./middlewares/fetchq-metric-reset')
const { fetchqMntRun } = require('./middlewares/fetchq-mnt-run')
const { fetchqMntRunAll } = require('./middlewares/fetchq-mnt-run-all')

const createV1Router = (settings) => {
    const router = express.Router()

    router.use(fetchqGetClient())

    router.get('/init', fetchqInit())
    router.get('/info', fetchqInfo())

    // queue api
    router.post('/q', fetchqCreateQueue())
    router.post('/q/:name', fetchqDocPush())
    router.delete('/q/:name', fetchqDropQueue())

    // document api
    router.post('/pick', fetchqDocPick())
    router.post('/reschedule', fetchqDocReschedule())
    router.post('/reject', fetchqReject())
    router.post('/complete', fetchqComplete())
    router.post('/kill', fetchqKill())
    router.post('/drop', fetchqDrop())

    // metrics
    router.post('/metric/log/pack', fetchqMetricLogPack())
    router.post('/metric/get/total', fetchqMetricGetTotal())
    router.post('/metric/get/common', fetchqMetricGetCommon())
    router.post('/metric/get', fetchqMetricGet())
    router.post('/metric/compute', fetchqMetricCompute())
    router.post('/metric/reset', fetchqMetricReset())

    // maintenance
    router.post('/mnt/run/all', fetchqMntRunAll())
    router.post('/mnt/run', fetchqMntRun())

    return router
}

module.exports = {
    createV1Router,
}
