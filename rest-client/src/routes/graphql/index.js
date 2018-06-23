const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const createGraphqlRouter = (settings) => {
    const router = express.Router()


    const schema = buildSchema(`
        type Query {
            hello: String
        }
    `)

    const root = { hello: () => 'Hello world!' }

    router.use('/', graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }))

    return router
}

module.exports = {
    createGraphqlRouter,
}
