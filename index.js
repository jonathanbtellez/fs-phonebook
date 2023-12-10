require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Contact = require('./models/contact')


morgan.token('body', (req) => {
    if (req.body) {
        return JSON.stringify(req.body)
    }
})

//make express run static content
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :response-time :body '))

//handle cors
app.use(cors())


app.get('/api/v1/persons', (req, res) => {
    Contact.find({}).then(notes => {
        res.json(notes)
    })
})

app.post('/api/v1/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name is missing' })
    }

    if (body.number === undefined) {
        return res.status(400).json({ error: 'number is missing' })
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
    })

    contact.save().then(savedContact => {
        res.json(savedContact)
    })
})

app.get('/api/v1/persons/:id', (req, res) => {
    Contact.findById(req.params.id).then(contact => {
        if (contact) {
            res.json(contact)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.put('/api/v1/persons/:id', (req, res, next) => {
    const body = req.body

    const contact = {
        name: body.name,
        number: body.number
    }
    Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(updatedContact => {
            res.json(updatedContact)
        })
        .catch(error => next(error))
})


app.delete('/api/v1/persons/:id', (req, res, next) => {
    Contact.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/api/v1/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>
    `)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// Use error handler
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})