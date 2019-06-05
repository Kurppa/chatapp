const Message = require('../../models/messageModel')

const typeDefs = `
    type Message {
        text: String!,
        chat: String!,
    }

    extend type Query {
        messageDummy: String
    }

    extend type Mutation {
        createMessage(
            text: String!
            chat: String!
        ): String
    }
`

const resolvers = {
    Query: {
        messageDummy: () => 'this is from messageModule'
    },
    Mutation: {
        createMessage: (root, args) => {
            return 'not implemented'
        }
    }
}

module.exports = { typeDefs, resolvers }
