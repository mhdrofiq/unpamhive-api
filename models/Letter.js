const mongoose = require('mongoose')

const letterSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        letterNumber: {
            type: String,
            default: 'NA'
        },
        letterType: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            default: 'NA'
        },
        start: { 
            type: Date, 
            default: Date.now 
        },
        end: { 
            type: Date, 
            default: Date.now 
        },
        letterStatus: {
            type: String,
            default: 'NA'
        },
        rejectMessage: {
            type: String,
            default: 'NA'
        },
        file: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Letter', letterSchema)