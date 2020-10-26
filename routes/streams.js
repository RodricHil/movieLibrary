const express = require('express')
const { route } = require('.')
const router = express.Router()
const Stream = require('../models/stream')
const Movie = require('../models/movie')

// All Stream Route

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
     searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const streams = await Stream.find(searchOptions)
        res.render('streams/index', {
            streams: streams,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Stream Route

router.get('/new', (req, res) => {
    res.render('streams/new',{ stream: new Stream()})
})

// Create Stream Route
router.post('/', async (req, res) => {
    const stream = new Stream({
        name: req.body.name
    })
    try {
        const newStream = await stream.save()
        res.redirect('streams')
    } catch {
        res.render('streams/new', {
            stream: stream,
            errorMessage : 'Error Creating Stream'
        })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const stream = await Stream.findById(req.params.id)
        const movies = await Movie.find({ stream: stream.id }).limit(6).exec()
        res.render('streams/show', {
            stream: stream,
            moviesByStream: movies
        })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})


router.get('/:id/edit', async(req, res) => {
    try {
       const stream = await Stream.findById(req.params.id) 
       res.render('streams/edit', { stream: stream})
    } catch {
        res.redirect('/streams')
    }
})

router.put('/:id', async (req, res) => {
    let stream
    try {
        stream = await Stream.findById(req.params.id)
        stream.name = req.body.name
        await stream.save()
        res.redirect(`/streams/${stream.id}`)
    } catch {
        if (stream == null) {
            res.redirect('/')
        }
        else {
            res.render('streams/edit', {
            stream: stream,
            errorMessage : 'Error updating Stream'
            })
        }
       
    }
})

router.delete('/:id', async (req, res) => {
    let stream
    try {
        stream = await Stream.findById(req.params.id)
        await stream.remove()
        res.redirect('/streams')
    } catch {
        if (stream == null) {
            res.redirect('/')
        }
        else {
            res.redirect(`/streams/${stream.id}`)
        } 
    }
})

module.exports = router