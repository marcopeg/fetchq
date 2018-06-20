
const { Pool } = require('pg')
const env = require('../../src/services/env')

let pool = null

const init = async () => {
    if (pool) {
        return pool
    }

    await env.init()
    pool = new Pool()
    return pool
}

const dropSchema = async () => {
    await init()
    await pool.query('DROP SCHEMA public CASCADE;')
    await pool.query('CREATE SCHEMA public;')
}

const reset = async () => {
    await init()
    await dropSchema()
    await pool.query('CREATE EXTENSION fetchq;')
    await pool.query('SELECT * FROM fetchq_init();')
}

const query = q => pool.query(q)

module.exports = {
    dropSchema,
    reset,
    query,
}

