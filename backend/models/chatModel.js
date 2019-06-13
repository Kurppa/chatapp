const mongoose = require('mongoose')
const User = require('./userModel')
const Message = require('./messageModel')

const chatSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    date: {
        type: Date,
        default: Date.now
    }
})

chatSchema.post('findOneAndDelete', (doc) => {
    if (doc) {
        doc.users.forEach(uId => {
            User.update({ _id: uId }, { $pull: { chats: doc._id }})
        })
        Message.deleteMany({ chat: doc._id })
    }
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
