const { AuthenticationError, UserInputError } = require('apollo-server-express')

const argon2 = require('argon2')

const User = require('../../models/userModel')
const Chat = require('../../models/chatModel')

const typeDefs = `
    type Me {
        id: ID!
        username: String!
        friends: [User!]
        sentRequests: [User!]
        friendRequests: [User!]
        chats: [Chat]
    }
    
    type User {
        username: String!
        id: ID!
    }

    extend type Query {
        getUserData: Me!
        findUser(searchterm: String): User
    }

    extend type Mutation {
        createUser(
            username: String!
            password: String!
        ): ID
        
        acceptFriendRequest (
            id: ID!
        ): ID

        addFriend(
            id: ID!
        ): ID
        
        removeFriend(
            id: ID!
        ): ID

        deleteUser(
            username: String!
            password: String!
        ): String
    }
`

const resolvers = {
    Query: {
        getUserData: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError('wrong credentials')
            }
            
            return User.findById(currentUser._id)
                .populate('friends', { username: 1})
                .populate('friendRequests', { username: 1})
                .populate('sentRequests', { username: 1})
                .populate('chats', { users: 1, messages: 1})
            
        },
        findUser: async (root, args) => {
            if (args.searchterm) {
                //const searchRegex = { $regex: `^${args.searchterm}`}
                const user = await User.findOne({ username: args.searchterm })
                return user || null
            } else {
                return null
            }
        } 
    },
    Mutation: {
        createUser: async (root, args) => { 
            const passwordHash = await argon2.hash(args.password, {
                type: argon2.argon2id
            })
            
            const user = new User({ 
                username: args.username,
                passwordHash
            })

            const savedUser = await user.save()

            return savedUser._id
        },
        addFriend: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new UserInputError('u are not logged in')
            } 
            
            if(currentUser._id.toString() === args.id.toString()) {
                return
            }

            if (currentUser.sentRequests.find(id => (id.toString() === args.id.toString()))) {
                return
            }
            const friend = await User.findById(args.id)
            if (!friend ) {
                throw new UserInputError('Not logged in')
            }
            currentUser.sentRequests.push( friend._id )
            await currentUser.save()
            friend.friendRequests.push( currentUser._id )
            await friend.save()
            return friend.username
        },
        acceptFriendRequest: async (root,args, { currentUser }) => {
            const friend = await User.findById(args.id)
            if (friend && !currentUser.friends.find(id => args.id === id.toString())) {
                currentUser.friends.push(friend._id)
                currentUser.friendRequests = currentUser.friendRequests.filter(id => id === friend._id)
                currentUser.save()
                friend.friends.push(currentUser._id)
                friend.sentRequests = friend.sentRequests.filter(id => id === currentUser._id)
                friend.save()
            } else {
                throw new UserInputError('wrong user id')
            }
        },
        deleteUser: async (root, args, context) => {
            return 'not implemented'
        },
        removeFriend: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new UserInputError('Not logged in')
            }
            
            const friend = await User.findById(args.id) 
            
            friend.friends = friend.friends.filter(id => id.toString() !== currentUser._id.toString() )
            currentUser.friends = currentUser.friends.filter(id => id.toString() !== currentUser._id.toString() )
                
            await friend.save()
            await currentUser.save()
            console.log(friend, currentUser)
            if (friend) {
              Chat.findOneAndDelete({ users: {
                    $all: [ friend._id, currentUser._id ]
                }}, (error, doc) => {
                    console.log(error)
                }) 
            } 


        },
    }
}

module.exports = { typeDefs, resolvers }
