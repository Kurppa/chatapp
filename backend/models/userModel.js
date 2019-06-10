const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseHidden = require('mongoose-hidden')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        unique: true
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
        
    ],
    //blocked not in use rn
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    sentRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
        
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    date: {
        type: Date,
        default: Date.now,
        hide: true
    },
    passwordHash: {
        type: String,
        hide: true // toJSON and toObject methods hide this field by default
    }
})

userSchema.plugin(mongooseHidden)
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
