const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

let persons = [
    { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
]

// Route for root
app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

// Route for persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Route for person
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Route for info
app.get('/info', (request, response) => {
    const n = persons.length
    response.send(`<p>Phonebook has info for ${n} people</p><p>${String(Date())}</p>`)
})

// Route for delete
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    let newId;
    do {
        newId = String(Math.floor(Math.random() * 10000));
    } while (persons.some(person => person.id === newId));

    return newId;
};

const isNameTaken = (name) => {
    return(persons.some(person => person.name === name))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body || !body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }

    if (isNameTaken(body.name)) {
        return response.status(400).json({
            error: "name is taken"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})