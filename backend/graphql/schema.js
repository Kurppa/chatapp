const { makeExecutableSchema } = require('apollo-server-express')
const { merge } = require('lodash')
const { typeDefs: userTypeDefs, resolvers: userResolvers} = require('./graphqlAssets/userGraphql')
const { typeDefs: chatTypeDefs, resolvers: chatResolvers} = require('./graphqlAssets/chatGraphql')
const { typeDefs: messageTypeDefs, resolvers: messageResolvers} = require('./graphqlAssets/messageGraphql')
const { typeDefs: loginTypeDefs, resolvers: loginResolvers} = require('./graphqlAssets/loginGraphql')

const Query = `
    type Query {
        _empty: String
    }

    type Mutation {
        _empty: String
    }

`

const typeDefs = [ Query, chatTypeDefs, userTypeDefs, messageTypeDefs, loginTypeDefs]

const resolvers = merge(chatResolvers, userResolvers,  messageResolvers, loginResolvers)

module.exports = { typeDefs, resolvers }
