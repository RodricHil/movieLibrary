const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')

router.get('/', async (req, res) => {
    let movies
    try {
        movies = await Movie.find().sort({
            createAt:'desc'
        }).limit(10).exec()
    } catch (error) {
        Movies = []
    }
    res.render('index', {movies: movies})
})

module.exports = router