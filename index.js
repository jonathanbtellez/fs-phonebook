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
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404).end()
        return
    }
})


app.delete('/api/v1/persons/:id', (req, res) => {
    Contact.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
})

app.get('/api/v1/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>
    `)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})