const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Movie = require('../models/movie')
const Stream = require('../models/stream')
const movie = require('../models/movie')
const uploadPath = path.join('public', Movie.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null,imageMimeTypes.includes(file.mimetype))
    }
})
// All Movie Route
router.get('/', async (req, res) => {
    let query = Movie.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishedBefore', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishedAfter', req.query.publishedAfter)
    }
    try {
        const movies = await query.exec()
        res.render('movies/index', {
            movies: movies,
            searchOptions: req.query
        })
    } catch {
       res.redirect('/') 
    }
})

// New Movie Route

router.get('/new', async (req, res) => {
    renderNewPage(res, new Movie())
})

// Create Movie Route
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const movie = new Movie({
        title: req.body.title,
        stream: req.body.stream,
        publishDate: new Date(req.body.publishDate),
        runningTime: req.body.runningTime,
        coverImageName: fileName,
        description: req.body.description
    })
    try {
        const newMovie = await movie.save()
        res.redirect('movies')
    } catch {
        if (movie.coverImageName != null) {
             removeMovieCover(movie.coverImageName)
        }
        renderNewPage(res, movie, true)
    }
})

function removeMovieCover(fileName) {
    fs.unlinkSync(path.join(uploadPath, fileName), err => {
        if (err)
            console.error(err)
    
    })
}

async function renderNewPage(res, movie, hasError = false) {
    try {
        const streams = await Stream.find({})
        const params = {
            streams: streams,
            movie: movie
        }
        if (hasError) params.errorMessage = 'Error Creating Movie'
        res.render('movies/new', params)
         
    }catch {
        res.redirect('/movies')
    }
}

module.exports = router