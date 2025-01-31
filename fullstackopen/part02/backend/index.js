const express = require('express');
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Note = require('./models/note')

const app = express();

const requestLogger = (request, response, next) => {
  console.log('My simple request/response LOGGER >>')
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());
app.use(requestLogger);

morgan.token('payload', function getBody (req) { return JSON.stringify(req.body) })
app.use(morgan('THE MORGAN MIDDLEWARE LOGGER >> :method :url :status :res[content-length] - :response-time ms :payload'))

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {

      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => {
      // console.log(error)
      // response.status(400).send({ error: 'malformatted id' })
      return next(error);
    })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body
  if(!body.content) return response.status(400).json({error:'content is missing'})
  // else if(!body.important) return response.status(400).json({error:'importance information is missing'})
  // else if(notes.find(note=>note.content===body.content)) return response.status(400).json({error:'already in the notes! content must be unique'})

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => { response.json(savedNote) })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('From the - AllErrorsHandledAtSinglePlace handler', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'the malformatted id' })
    } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})