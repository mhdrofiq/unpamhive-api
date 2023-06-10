const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{
        // for multiple roles
            // type: [String],
            // default: ['Student']
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)