const mongoose = require('mongoose')

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Stream', streamSchema)