const http = require('http')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

const jwt = require('jsonwebtoken')
const User = require('./models/userModel')

const { validateToken, findUser, findTokenFromWS } = require('./helpers')
const { connectDb } = require('./config')
const { typeDefs, resolvers} = require('./graphql/schema')

const testRouter = require('./controllers/testController')

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: async (_, ws) => {
            // try to get id token -> check that token is valid and decode -> find user
            // rejected promise results in failed subscription
            // approach quarantees that subscription resolver has always user available
            // and that only logged in users can subscribe to newMessage
            return findTokenFromWS(ws.upgradeReq)
                        .then(idCookie => validateToken(idCookie))
                        .then(token => findUser(token.id))
                        .then( user => {
                            return {
                                currentUser: user
                            }
                        })
        }
    },
    context: async ({ req, res, connection }) => {
        if (connection) {
            return connection.context
        } else {
            const auth = req ? req.headers.authorization : null
            const id = req.cookies.id
            if (id){
                const decodedToken = jwt.verify(
                    id, process.env.SECRET
                )
                const currentUser = await User.findById(decodedToken.id)
                return { currentUser, res }
            } else {
                return { res }
            }
        }
    }
})

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(cookieParser())

app.use('/', testRouter) //just says hello world : ) 

app.use(morgan('tiny'))

server.applyMiddleware({ 
    app,
    cors: false,
})

const httpServer = http.createServer(app)

server.installSubscriptionHandlers(httpServer)

const PORT = process.env.PORT || 3000

connectDb()
    .then(async () => {
        httpServer.listen(PORT, () => {
            console.log(`GraphQl endpoint at http://localhost:${PORT}${server.graphqlPath}`)
            console.log(`Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
        }
        )
    })
    .catch(e => {
        console.log('Failed connecting to MongoDB-database', e.message)
    }) 
