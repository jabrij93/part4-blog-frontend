import Blog from './components/Blog.jsx'
import { useState, useEffect } from 'react'
import blogService from './services/blogService.js'
import loginService from './services/login'
import Notification from './components/Notification.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlogs] = useState('add a new blog..')
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [notifications, setNotifications] = useState(null)
  const [user, setUser] = useState(null) 

  useEffect(() => {
    console.log('effect')
    blogService 
      .getAll()
      .then(initialBlogs => {
        console.log('Fetched blogs:', initialBlogs)
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addNote = (event) => {
    event.preventDefault()

    const blogObject = {
      content: newBlog,
      important: Math.random() < 0.5,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogs('')
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
      blogService.setToken(user.token)
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

  const blogForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newBlog}
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

  const blogsToShow = showAll ? blogs : blogs.filter(blog => blog.important === true)
  console.log('Blogs to show:', blogsToShow)

  const toggleImportanceOf = (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, important: !blog.important }

    blogService
      .update(id, changedNote)
        .then(returnedBlog => { 
          setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog)) 
        })
        .catch(error=> {
          alert(`the blog '${blog.content}' was already deleted from server`)
          setBlogs(blogs.filter(n => n.id === id ))
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
        {Array.isArray(blogsToShow) && blogsToShow.map(blog => 
          <Blog 
            key={blog.id} 
            blog={blog} 
            toggleImportance={() => toggleImportanceOf(blog.id)} 
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newBlog} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App