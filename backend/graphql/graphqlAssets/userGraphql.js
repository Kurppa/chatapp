const { AuthenticationError, UserInputError } = require('apollo-server-express')
const bcrypt = require('bcrypt')
const User = require('../../models/userModel')
const Chat = require('../../models/chatModel')

const typeDefs = `
    type User {
        username: String!
        friends: [Friend!]
        chats: [String!]
    }
    
    type Friend {
        username: String!
        id: ID!
    }

    extend type Query {
        getUserData: User!
        getAllUsers(searchterm: String): [String!]
        dummy: User
    }

    extend type Mutation {
        createUser(
            username: String!
            password: String!
        ): String
        
        addFriend(
            username: String!
        ): String
        
        deleteUser(
            username: String!
            password: String!
        ): String
    }
`

const resolvers = {
    Query: {
        dummy: async (root, args) => {
            const user = await User.findOne({ username: 'kara' })
                    .populate('friends', { username: 1})
            return user
        },
        getUserData: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('wrong credentials')
            }
            
            return User.findById(currentUser._id)
                .populate('friends', { username: 1})
                .populate('chats')
            
        },
        getAllUsers: async (root, args) => {
            if (args.searchterm) {
                const searchRegex = { $regex: `^${args.searchterm}`}
                const users = await User.find({ username: searchRegex })
                return users.map(u => u.username)
            } else {
                const users = await User.find({})
                return users.map(u => u.username)
            }
        } 
    },
    Mutation: {
        createUser: async (root, args) => { 
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(args.password, saltRounds)
            
            const user = new User({ 
                username: args.username,
                passwordHash
            })

            const savedUser = await user.save()

            return savedUser.username
        },
        addFriend: async (root, args, { currentUser }) => {
            const friend = await User.findOne({ username: args.username })
            if (!friend) {
                throw new UserInputError('no such user')
            }
            currentUser.friends = currentUser.friends.concat(friend._id)
            const chat = new Chat({
                users: [ currentUser.id, friend._id]
            }) 
            const savedChat = await chat.save()
            friend.chats = friend.chats.concat(savedChat._id)
            currentUser.chats = currentUser.chats.concat(savedChat._id)
            await currentUser.save()
            await friend.save()
            return friend.username
        },
        deleteUser: async (root, args, context) => {
            return 'not implemented'
        }
    }
}

module.exports = { typeDefs, resolvers }
