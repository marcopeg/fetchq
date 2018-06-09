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
}

module.exports = {
    Fetchq
}
