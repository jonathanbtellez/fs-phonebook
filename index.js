const express = require('express')
const morgan = require('morgan')
const app = express()
morgan.token('body', (req) => {
    if (req.body) {
        return JSON.stringify(req.body)
    }
})
app.use(express.json())
app.use(morgan(':method :url :response-time :body '))

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: 3124567847
    },
    {
        id: 2,
        name: 'Pedro Castro',
        number: 3124567840
    },
    {
        id: 3,
        name: 'Ana Rita',
        number: 3124567843
    },
    {
        id: 4,
        name: 'Francis Monroy',
        number: 3124567845
    },
]

app.get('/api/v1/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/v1/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        res.status(400).send({ error: "Number is required" }).end();
        return
    }

    if (!body.number) {
        res.status(400).send({ error: "Number is required" }).end();
        return
    }

    const isNameUnique = persons.find(person => person.name === body.name)
    const isNumberUnique = persons.find(person => person.number === Number(body.number))

    if (isNameUnique) return res.status(400).send({ error: "Name must be unique" }).end();
    if (isNumberUnique) return res.status(400).send({ error: "Number must be unique" }).end();


    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }


    persons = [...persons, person]

    res.json(person)
})

app.get('/api/v1/person/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        res.status(404).end()
        return
    }
})


app.delete('/api/v1/person/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/api/v1/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>
    `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})