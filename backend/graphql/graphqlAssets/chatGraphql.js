const { UserInputError, AuthenticationError } = require('apollo-server-express')
const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')

const typeDefs = `
    type Chat {
        id: ID!
        users: [ID]!
        messages: [ID]!
    }

    extend type Mutation {
        createChat(
            username: String!
        ): Chat
    }

`

const resolvers = {
    Mutation: {
        createChat: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const user = await User.findOne({username: args.username})
            if (user) {
                const chat = new Chat()
                chat.users = [user._id, currentUser._id]
                const savedChat = await chat.save()
                user.chats = user.chats.concat(savedChat._id)
                await user.save()
                currentUser.chats = currentUser.chats.concat(savedChat._id)
                await currentUser.save
                
                return chat
            } else {
                throw new UserInputError('No such user')
            }
        }
    }, 
}

module.exports = { typeDefs, resolvers }
