import Blog from './components/Blog.jsx';
import { useState, useEffect, useRef } from 'react';
import BlogForm from './components/BlogForm.jsx';
import blogService from './services/blogService.js';
import loginService from './services/login';
import Notification from './components/Notification.jsx';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [likes, setLikes] = useState(blogs.likes);
  const [showAll, setShowAll] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState(null);
  const [user, setUser] = useState(null);
  console.log('User:', user);

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs);
      });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog));

        setNotifications({ message: `Added ${returnedBlog.title} by ${returnedBlog.author}`, type: 'success' });
        setTimeout(() => {
          setNotifications(null);
        }, 5000);

        // Delay the toggleVisibility call
        setTimeout(() => {
          blogFormRef.current.toggleVisibility();
        }, 0); // Adjust the delay as needed
      })
      .catch(error => {
        setNotifications({ message: error.response.data.error, type: 'error' });
        setTimeout(() => {
          setNotifications(null);
        }, 5000);
      });
  };

  const addLike = async (id, blogObject) => {
    console.log('Before setBlogs:', blogs);

    try {
      const returnedBlog = await blogService.update(id, blogObject);
      setLikes(returnedBlog.likes);
      console.log('Updated blog:', returnedBlog);
      // setBlogs(prevBlogs => prevBlogs.map(blog => (blog.id === id ? returnedBlog : blog)));
      setBlogs(blogs.map(blog => (blog.id === id ? returnedBlog : blog))); // Update the state with the new blog data
      console.log('After setBlogs:', blogs);
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

  const handleDelete = async (id) => {
    // Ensure user and blogs state is correctly set
    if (!user) {
      console.error('User is not logged in');
      return;
    }

    // Find the specific blog by id
    const blogToDelete = blogs.find(blog => blog.id === id);

    // Check if the blog was found
    if (!blogToDelete) {
      console.error('Blog not found');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${blogToDelete.title} by ${blogToDelete.author}?`);

    if (!confirmDelete) {
      return; // If the user clicks "Cancel", do nothing
    }

    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter(blog => blog.id !== id)); // Update state by filtering out the deleted blog
      setNotifications({ message: 'SUCCESSFULLY DELETED!', type: 'success' });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    } catch (error) {
      setNotifications({ message: error.message, type: 'error' });
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    }
  };

  const handleLogin = async (userCredentials) => {
    try {
      const user = await loginService.login(userCredentials);
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setNotifications({ message: `Logging in as ${user.name}`, type: 'success' });
    } catch (exception) {
      setNotifications({ message: 'wrong username or password', type: 'error' });
    }

    setTimeout(() => {
      setNotifications(null);
    }, 5000);
  };

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser'
      );
      setUser(null);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setNotifications('User logged out');
      setTimeout(() => {
        setNotifications(null);
      }, 5000);
    }
  };

  const loggedInUser = user;
  const loggedInUserID = user?.id;
  console.log('Logged-in user in Playwright:', loggedInUser);
  console.log('Logged-in user ID in Playwright:', loggedInUserID);


  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notifications?.message} type={notifications?.type}/>

      {user === null ? (
        <div>
          <Togglable buttonLabel='login' ref={blogFormRef}>
            <LoginForm
              userLogin={handleLogin}
            />
          </Togglable>
        </div>
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} user={loggedInUser} />
          </Togglable>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}
      <div>
        {blogs
          .slice() // Create a copy of the blogs array to avoid mutating the original
          .sort((a, b) => b.likes - a.likes) // Sort the array based on likes in descending order
          .map((blog) => {
            return (
              <Blog key={blog.id} blog={blog} updatedLike={addLike} blogId={handleDelete} loggedInUsernameID={loggedInUserID} buttonLabel="show"/>
            );})}
      </div>
      <p style={{ color: 'green', fontStyle: 'italic', fontSize: '25px' }}>Blog app, Department of Computer Science, University of Helsinki 2024</p>
    </div>
  );
};

export default App;