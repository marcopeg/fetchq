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

    async info () {
        try {
            const res = await this.pool.query('select * from fetchq_info()')
            return res.rows[0]
        } catch (err) {
            this.logger.debug(err)
            throw new Error(`[fetchq] info() - ${err.message}`)
        }
    }
}

module.exports = {
    Fetchq
}
