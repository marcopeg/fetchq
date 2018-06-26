const winston = require('winston')
const { Pool } = require('pg')

const { createConnect } = require('./functions/connect')
const { createInit } = require('./functions/init')
const { createInfo } = require('./functions/info')
const { createQueueList } = require('./functions/queue.list')
const { createQueueGet } = require('./functions/queue.get')
const { createQueueCreate } = require('./functions/queue.create')
const { createQueueDrop } = require('./functions/queue.drop')

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
    }

    // @TODO: validate queue name
    // @TODO: validate queue subject
    // @TODO: validate queue version
    // @TODO: validate queue priority
    // @TODO: validate queue nextIteration
    // @TODO: validate queue payload
    async docPush (queue, doc = {}) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_push(',
                `'${queue}',`,
                `'${doc.subject}',`,
                `${doc.version || 0},`,
                `${doc.priority || 0},`,
                doc.nextIteration ? `'${doc.nextIteration}',` : 'NOW(),',
                `'${JSON.stringify(doc.payload || {}).replace(/'/g, '\'\'\'\'')}'`,
                ')'
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] push() - ${err.message}`)
        }
    }

    async docPushMany (queue, data = {}) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_push(',
                `'${queue}',`,
                `${data.priority || 0},`,
                data.nextIteration ? `'${data.nextIteration}',` : 'NOW(),',
                '\'(',
                data.docs
                    .map(doc => [
                        `''${doc.subject}''`,
                        `${doc.priority || 0}`,
                        `''${JSON.stringify(doc.payload || {}).replace(/'/g, '\'\'\'\'')}''`,
                        '{DATA}'
                    ].join(', '))
                    .join('), ('),
                ')\')'
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] pushMany() - ${err.message}`)
        }
    }

    async docPick (queue = null, version = 0, limit = 1, duration = '5m') {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_pick(',
                `'${queue}',`,
                `${version},`,
                `${limit},`,
                `'${duration}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] pick() - ${err.message}`)
        }
    }

    async docReschedule (queue = null, documentId = 0, nextIteration = null, payload = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_reschedule(',
                `'${queue}',`,
                `${documentId},`,
                nextIteration === null ? 'NOW()' : `'${nextIteration}'`,
                payload === null ? '' : `, '${JSON.stringify(payload || {}).replace(/'/g, '\'\'\'\'')}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] doc_reschedule() - ${err.message}`)
        }
    }
    
    async docReject (queue = null, documentId = 0, errorMsg = null, errorDetails = null, refId = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_reject(',
                `'${queue}',`,
                `${documentId},`,
                `'${errorMsg || ''}',`,
                `'${JSON.stringify(errorDetails || {}).replace(/'/g, '\'\'\'\'')}'`,
                refId === null ? '' : `, '${refId}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] reject() - ${err.message}`)
        }
    }

    async docComplete (queue = null, documentId = 0, payload = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_complete(',
                `'${queue}',`,
                `${documentId},`,
                `'${JSON.stringify(payload || {}).replace(/'/g, '\'\'\'\'')}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] complete() - ${err.message}`)
        }
    }

    async docKill (queue = null, documentId = 0, payload = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_kill(',
                `'${queue}',`,
                `${documentId},`,
                `'${JSON.stringify(payload || {}).replace(/'/g, '\'\'\'\'')}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] kill() - ${err.message}`)
        }
    }

    async docDrop (queue = null, documentId = 0) {
        try {
            const q = [
                'SELECT * FROM fetchq_doc_drop(',
                `'${queue}',`,
                `${documentId}`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] drop() - ${err.message}`)
        }
    }

    async metricLogPack () {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_log_pack()',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricLogPack() - ${err.message}`)
        }
    }

    async metricGet (queue, metric = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_get(',
                `'${queue}'`,
                metric ? `, '${metric}'` : '',
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return metric ? res.rows[0] : res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricGet() - ${err.message}`)
        }
    }

    async metricGetTotal (metric) {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_get_total(',
                `'${metric}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricGetTotal() - ${err.message}`)
        }
    }

    async metricGetCommon (queue) {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_get_common(',
                `'${queue}'`,
                ')',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricGetCommon() - ${err.message}`)
        }
    }

    async metricGetAll () {
        try {
            const q = [
                'SELECT * FROM fetchq_metric_get_all()',
            ].join(' ')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] metricGetAll() - ${err.message}`)
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
