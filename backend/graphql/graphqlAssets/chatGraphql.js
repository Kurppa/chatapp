const { UserInputError, AuthenticationError } = require('apollo-server-express')
const Chat = require('../../models/chatModel')
const User = require('../../models/userModel')
const Message = require('../../models/messageModel')

const typeDefs = `
    type Chat {
        id: ID!
        users: [ID!]!
        messages: [ID]
    }
 
    extend type Query {
        chatMessages(id: ID!): [Message]
    }

    extend type Mutation {
        createChat(
            id: ID!
        ): ID
    }

`

const resolvers = {
    Query: {
        chatMessages: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
     
            const chat = await Chat.findById(args.id)
                            .populate('messages')

            if (!(chat && chat.users.find(id => id.toString() === currentUser._id.toString()))) {
                throw new AuthenticationError('not authenticated')
            }

            return chat.messages

        }        
    },
    Mutation: {
        createChat: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const friend = await User.findById(args.id)
                                .populate('chats')
            if (friend) {
                const chatExists = friend.chats.map(c => c.users).flat().find(id => id === friend._id)
                if (chatExists) {
                    throw new UserInputError('Chat already created')
                }
                const chat = new Chat({
                    users: [friend._id, currentUser._id]
                })
                const savedChat = await chat.save()
                friend.chats.push(savedChat._id)
                await friend.save()
                currentUser.chats.push(savedChat._id)
                await currentUser.save() 
                return savedChat._id
            } else {
                throw new UserInputError('No such user')
            }
        }
    }, 
}

module.exports = { typeDefs, resolvers }
