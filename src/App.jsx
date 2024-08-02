import Blog from './components/Blog.jsx'
import { useState, useEffect, useRef } from 'react'
import AddNewBlog from './components/AddNewBlog'
import blogService from './services/blogService.js'
import loginService from './services/login'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [likes, setLikes] = useState(blogs.likes)
  console.log("INSPECT blog App.jsx", blogs.likes)
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

  const blogFormRef = useRef()

  const addBlog = (blogObject) => {

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log("RETURNED BLOGS", returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        
        setNotifications({ message: `Added ${returnedBlog.title}! by ${returnedBlog.author}`, type: 'success' });
        setTimeout(() => {
          setNotifications(null)
        }, 5000)

        // Delay the toggleVisibility call
        setTimeout(() => {
          blogFormRef.current.toggleVisibility()
        }, 0) // Adjust the delay as needed
      })
      .catch(error => {
        setNotifications({ message: error.response.data.error, type: 'error' })
        setTimeout(() => {
          setNotifications(null)
        }, 5000)
      }) 
  }

  const addLike = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject);
      setLikes(returnedBlog.likes);
      setBlogs(blogs.map(blog => (blog.id === id ? returnedBlog : blog))); // Update the state with the new blog data
      setNotifications({ message: `Liked ${returnedBlog.title} by ${returnedBlog.author}!`, type: 'success' });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    } catch (error) {
      setNotifications({ message: error.response.data.error, type: 'error' });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    }
  };

  const handleLogin = async (userCredentials) => {
    try {
      const user = await loginService.login(userCredentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      setUser(user)
      setNotifications({ message: `Logging in as ${user.name}`, type: 'success' });
    } catch (exception) {
      setNotifications({ message: `wrong username or password`, type: 'error' })
    }

    setTimeout(() => {
      setNotifications(null)
    }, 5000)
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
            <Togglable buttonLabel='login' ref={blogFormRef}>
              <LoginForm
                userLogin={handleLogin}
              />
            </Togglable>
          </div>
        </div>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <AddNewBlog createBlog={addBlog} />
          </Togglable>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}

      {/* <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? 'important' : 'all' } 
      </button> */}
      <ul>
        {blogs.map((blog, index) => (
          <Blog key={blog.id} blog={blog} toggleImportance={() => toggleImportance(blog.id)} index={index + 1} updatedLike={addLike} />
        ))}
      </ul>
      <AddNewBlog createBlog={addBlog} />
    </div>
  )
}

export default App