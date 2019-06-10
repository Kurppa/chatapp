const { AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const argon2 = require('argon2')
const User = require('../../models/userModel')

const typeDefs = `
    extend type Mutation {
        login(
            username: String!
            password: String!
        ): Boolean
        
        logout: Boolean

    }
`

const resolvers = {
    Mutation: {
        login: async (root, args, { res }) => {
            const user = await User.findOne({ username: args.username })
            
            const passwordCorrect = 
                user === null
                    ? false
                    : await argon2.verify(user.passwordHash, args.password)

            if (!( user && passwordCorrect )) {
                throw new AuthenticationError('wrong credentials')
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            const token = jwt.sign(userForToken, process.env.SECRET)
            
            res.cookie("id", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 1 //1 day
            })

            return true
        },
        logout: async (root, args, { res, currentUser }) => {
            if (currentUser) {
                res.clearCookie("id")
                return true
            }
            return false
        }  
    }
}

module.exports = { typeDefs, resolvers }
