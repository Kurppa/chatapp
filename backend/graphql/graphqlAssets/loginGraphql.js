const { AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../../models/userModel')

const typeDefs = `
    extend type Mutation {
        login(
            username: String!
            password: String!
        ): String
    }
`

const resolvers = {
    Mutation: {
        login: async (root, args, { res }) => {
            const user = await User.findOne({ username: args.username })
            
            const passwordCorrect = 
                user === null
                    ? false
                    : await bcrypt.compare(args.password, user.passwordHash)

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
                maxAge: 1000 * 60 * 60 * 24 * 7
            })

            return user.username 
        }
    }
}

module.exports = { typeDefs, resolvers }
