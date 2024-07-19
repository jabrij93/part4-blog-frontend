import Note from './components/Note'
import { useState, useEffect } from 'react'
import noteService from './services/noteService'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNotes] = useState('add a new note..')
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [notifications, setNotifications] = useState(null)
  const [user, setUser] = useState(null) 

  useEffect(() => {
    console.log('effect')
    noteService 
      .getAll()
      .then(initialNotes => {
        console.log('Fetched notes:', initialNotes)
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNotes('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNotes(event.target.value)    
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotifications('Wrong credentials')
      setTimeout(() => {
        setNotifications(null)
      }, 5000)
    }
    setNotifications(`logging in with ${username}`)
    console.log('logging in with', username, password)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit">save</button>
    </form>  
  )

  const handleLogOut = async (event) => {
  
    try {
      window.localStorage.removeItem(
        'loggedNoteappUser'
      )
      setUser(null)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotifications('User logged out')
      setTimeout(() => {
        setNotifications(null)
      }, 5000)
    }
    console.log(`${username} logged out`)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)
  console.log('Notes to show:', notesToShow)

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
        .then(returnedNote => { 
          setNotes(notes.map(note => note.id === id ? returnedNote : note)) 
        })
        .catch(error=> {
          alert(`the note '${note.content}' was already deleted from server`)
          setNotes(notes.filter(n => n.id === id ))
        })

    console.log(`importance of ${id} needs to be toggled`)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={notifications?.message} type={notifications?.type}/> 

      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged-in</p> <button onClick={handleLogOut}>Log Out</button>
      </div>
    }

      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all' } 
      </button>
      <ul>
        {Array.isArray(notesToShow) && notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)} 
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App