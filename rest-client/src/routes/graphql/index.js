const fs = require('fs')
const path = require('path')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const { createResolver } = require('./resolver')

const schema = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8')

const createGraphqlRouter = (settings) => {
    const router = express.Router()

    router.use('/', graphqlHTTP({
        schema: buildSchema(schema),
        rootValue: createResolver(),
        graphiql: true,
    }))

    return router
}

module.exports = {
    createGraphqlRouter,
}
