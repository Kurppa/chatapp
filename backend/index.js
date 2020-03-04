const http = require('http')
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('./models/userModel')

const { validateToken, findUser, findTokenFromWS } = require('./helpers')
const { connectDb } = require('./config')
const { typeDefs, resolvers} = require('./graphql/schema')

const configurations = {
    production: { ssl: true, port: 3000, hostname: 'paff.me', cors: '' },
  development: { ssl: false, port: 4000, hostname: 'localhost', cors: 'http://localhost:3000' }
}

const environment = process.env.NODE_ENV || 'production'
const config = configurations[environment]

console.log(config.cors)

const apollo = new ApolloServer({ 
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: async (_, ws) => {
            //allow connecting only with a valid id
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
    origin: config.cors,
    credentials: true
}))

app.use(cookieParser())

app.use(morgan('tiny'))

app.use(express.static('build'))

app.get('/', (req, res, next) => {
    try {
        if (req.cookies.id) {
            const decodedToken = jwt.verify(
                req.cookies.id, process.env.SECRET
            )
            if (decodedToken.id) {
                res.redirect('/user')
            }
        } else {
            next()
        }
    } catch (e) {
        next();
    }
})

apollo.applyMiddleware({ 
    app,
    cors: false,
})

let server = http.createServer(app)

apollo.installSubscriptionHandlers(server)

connectDb()
    .then(async () => {
        server.listen({ port: config.port }, () => {
             console.log(`http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`)
        }
        )
    })
    .catch(e => {
        console.log('Failed connecting to MongoDB-database', e.message)
    }) 
