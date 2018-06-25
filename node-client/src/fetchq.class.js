const winston = require('winston')
const { Pool } = require('pg')

class Fetchq {
    constructor (config = {}) {
        this.pool = new Pool()
        this.logger = new winston.Logger({
            level: config.logLevel || 'verbose',
            transports: [
                new (winston.transports.Console)(),
            ]
        })
    }

    async connect () {
        try {
            const res = await this.pool.query('SELECT NOW()')
            this.logger.verbose(`[fetchq] now is: ${res.rows[0].now}`)
        } catch (err) {
            this.logger.error(`[fetchq] ${err.message}`)
            this.logger.debug(err)
            throw new Error('[fetchq] Could not connect to Postgres')
        }
    }

    async init () {
        try {
            await this.pool.query('CREATE EXTENSION IF NOT EXISTS fetchq;')
            const res = await this.pool.query('SELECT * FROM fetchq_init()')
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] info() - ${err.message}`)
        }
    }

    async info () {
        try {
            const q = 'SELECT * FROM fetchq_info()'
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] info() - ${err.message}`)
        }
    }

    async listQueues (settings = {}) {
        try {
            const q = [
                'SELECT ',
                settings.attributes
                    ? `${settings.attributes.join(', ')} `
                    : '* ',
                'FROM fetchq_sys_queues ORDER BY ',
                settings.sortBy
                    ? `${settings.sortBy } `
                    : 'name ',
                    settings.sortOrder
                    ? `${settings.sortOrder } `
                    : 'ASC ',
            ].join('')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] createQueue() - ${err.message}`)
        }
    }

    async getQueue (name, settings = {}) {
        try {
            const q = [
                'SELECT ',
                settings.attributes
                    ? `${settings.attributes.join(', ')} `
                    : '* ',
                'FROM fetchq_sys_queues ',
                `WHERE name = '${name}' `,
            ].join('')
            // console.log(q)
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] createQueue() - ${err.message}`)
        }
    }

    // @TODO: validate queue name
    async createQueue (name) {
        try {
            const q = `SELECT * FROM fetchq_create_queue('${name}')`
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] createQueue() - ${err.message}`)
        }
    }
    
    // @TODO: validate queue name
    async dropQueue (name) {
        try {
            const q = `SELECT * FROM fetchq_drop_queue('${name}')`
            const res = await this.pool.query(q)
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] dropQueue() - ${err.message}`)
        }
    }

    // @TODO: validate queue name
    // @TODO: validate queue subject
    // @TODO: validate queue version
    // @TODO: validate queue priority
    // @TODO: validate queue nextIteration
    // @TODO: validate queue payload
    async push (queue, doc = {}) {
        try {
            const q = [
                'SELECT * FROM fetchq_push(',
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

    async pushMany (queue, data = {}) {
        try {
            const q = [
                'SELECT * FROM fetchq_push(',
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
    
    async pick (queue = null, version = 0, limit = 1, duration = '5m') {
        try {
            const q = [
                'SELECT * FROM fetchq_pick(',
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

    async reschedule (queue = null, documentId = 0, nextIteration = null, payload = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_reschedule(',
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
            throw new Error(`[fetchq] pick() - ${err.message}`)
        }
    }
    
    async reject (queue = null, documentId = 0, errorMsg = null, errorDetails = null, refId = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_reject(',
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

    async complete (queue = null, documentId = 0, payload = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_complete(',
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

    async kill (queue = null, documentId = 0, payload = null) {
        try {
            const q = [
                'SELECT * FROM fetchq_kill(',
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

    async drop (queue = null, documentId = 0) {
        try {
            const q = [
                'SELECT * FROM fetchq_drop(',
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
}

module.exports = {
    Fetchq
}
