if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const MONGODB_URI = process.env.MONGODB_URI

const connectDb = () => {
    return mongoose.connect(MONGODB_URI, { useNewUrlParser: true})
}

module.exports = { connectDb }

