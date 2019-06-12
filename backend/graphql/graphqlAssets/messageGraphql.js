const { AuthenticationError } = require('apollo-server-express')
const Message = require('../../models/messageModel')
const Chat = require('../../models/chatModel')

const typeDefs = `
    type Message {
        id: ID!
        user: ID!
        chat: ID!
        date: String!
        text: String!
    }
    
    type Subscription {
        newMessage: Message
    }

    extend type Mutation {
        createMessage(
            text: String!
            chat: ID!
        ): Message!
    }
`

const resolvers = {
    Mutation: {
        createMessage: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('Not logged in')
            }

            const chat = await Chat.findById(args.chat)
            
            if (!(chat && chat.users.find(id => id.toString() === currentUser._id.toString()))) {
                throw new AuthenticationError('Not such chat')
            }
            
            const message = new Message({
                user: currentUser._id,
                chat: chat._id,
                text: args.text
            })
            
            const savedMessage = await message.save()

            chat.messages.push(savedMessage._id)

            await chat.save()

            return savedMessage
    
        }
    }
}

module.exports = { typeDefs, resolvers }
