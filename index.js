require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const Contact = require('./models/contact');

morgan.token('body', (req) => {
  if (req.body) {
    return JSON.stringify(req.body);
  }
  return '';
});

// make express run static content
app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :response-time :body '));

// handle cors
app.use(cors());

app.get('/api/v1/persons', (req, res) => {
  Contact.find({}).then((notes) => {
    res.json(notes);
  });
});

app.post('/api/v1/persons', (req, res, next) => {
  const { body } = req;

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact.save().then((savedContact) => {
    res.json(savedContact);
  }).catch((error) => next(error));
});

app.get('/api/v1/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id).then((contact) => {
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).end();
    }
  }).catch((error) => next(error));
});

app.put('/api/v1/persons/:id', (req, res, next) => {
  const { body } = req;

  const contact = {
    name: body.name,
    number: body.number,
  };
  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then((updatedContact) => {
      res.json(updatedContact);
    })
    .catch((error) => next(error));
});

app.delete('/api/v1/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get('/api/v1/info', (req, res) => {
  let persons = [];
  Contact.find({}).then((contacts) => {
    persons = [...contacts];
  });

  setTimeout(() => {
    res.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        `);
  }, 500);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  return next(error);
};

// Use error handler
app.use(errorHandler);

const { PORT } = process.env;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
