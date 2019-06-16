require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI

const connectDb = () => {
    return mongoose.connect(MONGODB_URI, { useNewUrlParser: true})
}

module.exports = { connectDb }

