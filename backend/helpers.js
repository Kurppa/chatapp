const jwt = require('jsonwebtoken')
const User = require('./models/userModel')

const validateToken = token => (
    new Promise((resolve, reject) => {
        try {
            const decodedToken = jwt.verify(
                token,
                process.env.SECRET
            )
            if (decodedToken) {
                resolve(decodedToken)
            } else {
                reject(new Error('Token not valid'))
            }
        } catch (e) {
            reject( new Error('Unhandled error'))
        }   
    })    
)

const findUser = id => {
    return new Promise((resolve, reject) => {
        try {
            User.findById(id, function (error, doc) {
                if (!error || !doc ) {
                    resolve(doc)
                } else {
                    reject(new Error('No user found'))
                }
            })
        } catch {
            reject(new Error('No user found'))
        }
    })
}

const findTokenFromWS = req => (
    new Promise((resolve, reject) => {
        try {
            let token = req.headers.cookie.startsWith('id=') 
                ? req.headers.cookie.slice(3)
                : null
            if (!token) {
                reject(new Error('No token in request'))
            } else {
                resolve(token)
            }
        } catch (e) {
            reject( new Error('Unhandled error'))
        }
    })
)

module.exports = { validateToken, findUser, findTokenFromWS }
