import Blog from './components/Blog.jsx'
import { useState, useEffect } from 'react'
import AddNewBlog from './components/AddNewBlog'
import blogService from './services/blogService.js'
import loginService from './services/login'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlogs] = useState('add a new blog..')
  const [newTitle, setNewTitles] = useState('')
  const [newAuthor, setNewAuthors] = useState('')
  const [newUrl, setNewUrls] = useState('')
  const [newLike, setNewLikes] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [notifications, setNotifications] = useState(null)
  const [user, setUser] = useState(null) 
  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    blogService 
      .getAll()
      .then(initialBlogs => {
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

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLike === undefined ? 0 : Number(newLike) 
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitles('')
        setNewAuthors('')
        setNewUrls('')
        setNewLikes('')
        setNotifications({ message: `Added ${newTitle}! by ${newAuthor}`, type: 'success' });
        setTimeout(() => {
          setNotifications(null)
        }, 5000)
      })
      .catch(error => {
        setNotifications({ message: error.response.data.error, type: 'error' })
        setTimeout(() => {
          setNotifications(null)
        }, 5000)
      }) 
  }

  const handleTitleChange = (event) => {
    setNewTitles(event.target.value)    
  }

  const handleAuthorChange = (event) => {
    setNewAuthors(event.target.value)    
  }

  const handleUrlChange = (event) => {
    setNewUrls(event.target.value)    
  }

  const handleLikeChange = (event) => {
    setNewLikes(event.target.value)    
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotifications({ message: `wrong username or password`, type: 'error' })
    }

    setTimeout(() => {
      setNotifications(null)
    }, 5000)
    
    // setNotifications(`logging in with ${username}`)
    console.log('logging in with', username, password)
  }

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser'
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

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notifications?.message} type={notifications?.type}/> 

      {user === null ? (
        <div>
          <div style={{ display: loginVisible ? 'none' : '' }}>
            <button onClick={() => setLoginVisible(true)}>log in</button>
          </div>
          <div style={{ display: loginVisible ? '' : 'none' }}>
              <LoginForm
                username={username}
                password={password}
                handleCancel={()=>setLoginVisible(false)}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
              />
          </div>
        </div>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel='Create New Blog'>
            <AddNewBlog addBlog={addBlog}
              handleTitleChange={handleTitleChange} newTitle={newTitle} 
              handleAuthorChange={handleAuthorChange} newAuthor={newAuthor} 
              handleLikeChange={handleLikeChange} newLike={newLike}
              handleUrlChange={handleUrlChange} newUrl={newUrl} 
            />
          </Togglable>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}

      {/* <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all' } 
      </button> */}
      <ul>
        {blogs.map((blog, index) => (
          <Blog key={blog.id} blog={blog} toggleImportance={() => toggleImportance(blog.id)} index={index + 1} />
        ))}
      </ul>
      <AddNewBlog addBlog={addBlog}
        handleTitleChange={handleTitleChange} newTitle={newTitle} 
        handleAuthorChange={handleAuthorChange} newAuthor={newAuthor} 
        handleLikeChange={handleLikeChange} newLike={newLike}
        handleUrlChange={handleUrlChange} newUrl={newUrl} 
      />
    </div>
  )
}

export default App