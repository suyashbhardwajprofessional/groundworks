const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

/*notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})*/

// THE NEWER WAY!! USING async & await
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username:1, name:1 })
  response.json(notes)
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) { return authorization.replace('Bearer ', '') }
  return null
}

notesRouter.get('/:id', async (request, response, next) => {
  /*Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))*/

  /*try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch(exception) { next(exception) }*/

  const note = await Note.findById(request.params.id)
    if (note) { response.json(note)
    } else { response.status(404).end() }
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  // const user = await User.findById(body.userId)

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if(!decodedToken.id) { return response.status(401).json({ error: 'token invalid' }) }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

  /*note.save()
    .then(savedNote => {
      response.status(201).json(savedNote)
    })
    .catch(error => next(error))*/

  /*NEWER WAY! NO NEED OF CHAINING...*/
  /*try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch(exception) { next(exception) }*/

  // NO NEED OF TRY CATCH BLOCKS - library support
  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
  /*Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))*/

  /*try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) { next(exception) }*/

  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter