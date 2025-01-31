import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNoteChange = (event) => { setNewNote(event.target.value) }
  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: notes.length + 1,
    }
    noteService
      .create(noteObject)
      /*.then(response => {
        setNotes(notes.concat(response.data))*/
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    // const url = `http://localhost:3001/notes/${id}`
    // axios.put(url, changedNote).then(response => {
    //   setNotes(notes.map(n => n.id === id ? response.data : n))
    // })

    noteService
      .update(id, changedNote)
      /*.then(response => {
        setNotes(notes.map(note => note.id === id ? response.data : note))*/
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        // alert(`the note '${note.content}' was already deleted from server`)
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {setErrorMessage(null)}, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  useEffect(() => {
    console.log('effect')
    // axios
    //   .get('http://localhost:3001/notes')
    //   .then(response => {
    //     console.log('promise fulfilled')
    //     setNotes(response.data)
    //   })

    // const eventHandler = response => {
    //   console.log('promise fulfilled')
    //   setNotes(response.data)
    // }
    // const promise = axios.get('http://localhost:3001/notes')
    // promise.then(eventHandler)

    noteService
      .getAll()
      /*.then(response => {
        setNotes(response.data)*/
      .then(initialNotes => { 
        setNotes(initialNotes)
      })
  }, [])

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
      <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer /> 
    </div>
  )
}

export default App