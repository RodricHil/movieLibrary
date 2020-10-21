const express = require('express')
const { route } = require('.')
const router = express.Router()
const Stream = require('../models/stream')

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

module.exports = router