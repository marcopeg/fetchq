const express = require('express')

const createV1Router = (settings) => {
    const router = express.Router()

    router.get('/', (req, res) => res.send('v1'))

    return router
}

module.exports = {
    createV1Router,
}
