const mongoose = require('mongoose')
const Movie = require('./movie')

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

streamSchema.pre('remove', function (next) {
    Movie.find({ stream: this.id }, (err, movies) => {
        if (err) {
            next(err)
        } else if (movies.length > 0) {
            next(new Error('This stream has movies still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Stream', streamSchema)