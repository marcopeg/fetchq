const winston = require('winston')
const { Pool } = require('pg')

const { createConnect } = require('./functions/connect')
const { createInit } = require('./functions/init')
const { createInfo } = require('./functions/info')
const { createQueueList } = require('./functions/queue.list')
const { createQueueGet } = require('./functions/queue.get')
const { createQueueCreate } = require('./functions/queue.create')
const { createQueueDrop } = require('./functions/queue.drop')
const { createDocPush } = require('./functions/doc.push')
const { createDocPushMany } = require('./functions/doc.push-many')
const { createDocPick } = require('./functions/doc.pick')
const { createDocReschedule } = require('./functions/doc.reschedule')
const { createDocReject } = require('./functions/doc.reject')
const { createDocComplete } = require('./functions/doc.complete')
const { createDocKill } = require('./functions/doc.kill')
const { createDocDrop } = require('./functions/doc.drop')
const { createMetricLogPack } = require('./functions/metric.log-pack')
const { createMetricGet } = require('./functions/metric.get')
const { createMetricGetTotal } = require('./functions/metric.get-total')
const { createMetricGetCommon } = require('./functions/metric.get-common')
const { createMetricGetAll } = require('./functions/metric.get-all')

class Fetchq {
    constructor (config = {}) {
        this.pool = new Pool()
        this.logger = new winston.Logger({
            level: config.logLevel || 'verbose',
            transports: [
                new (winston.transports.Console)(),
            ]
        })

        this.connect = createConnect(this)
        this.init = createInit(this)
        this.info = createInfo(this)

        this.queue = {
            list: createQueueList(this),
            get: createQueueGet(this),
            create: createQueueCreate(this),
            drop: createQueueDrop(this),
        }

        this.doc = {
            push: createDocPush(this),
            pushMany: createDocPushMany(this),
            pick: createDocPick(this),
            reschedule: createDocReschedule(this),
            reject: createDocReject(this),
            complete: createDocComplete(this),
            kill: createDocKill(this),
            drop: createDocDrop(this),
        }

        this.metric = {
            logPack: createMetricLogPack(this),
            get: createMetricGet(this),
            getTotal: createMetricGetTotal(this),
            getCommon: createMetricGetCommon(this),
            getAll: createMetricGetAll(this),
        }
    }


    async metricCompute (queue) {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_compute(',
                `'${queue}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricCompute() - ${err.message}`)
        }
    }

    async metricComputeAll () {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_compute_all()',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricComputeAll() - ${err.message}`)
        }
    }
    
    async metricReset (queue) {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_reset(',
                `'${queue}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricReset() - ${err.message}`)
        }
    }

    async metricResetAll () {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_reset_all()',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricResetAll() - ${err.message}`)
        }
    }

    async mntRun (queue, limit = 100) {
        try {
            const q = [
                'SELECT * FROM fetchq_mnt_run(',
                `'${queue}',`,
                limit,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] mntRun() - ${err.message}`)
        }
    }

    async mntRunAll (limit = 100) {
        try {
            const q = [
                'SELECT * FROM fetchq_mnt_run_all(',
                limit,
                ')',
            ].join(' ')
            const res = await this.pool.query(q)
            return res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] mntRunAll() - ${err.message}`)
        }
    }
}

module.exports = {
    Fetchq
}
