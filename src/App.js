import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
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
      notify('wrong username or password', 'alert')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL
    }

    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${newTitle} by ${newAuthor} added`)
      setNewTitle('')
      setNewAuthor('')
      setNewURL('')
    } catch (exception) {
      notify(exception.response.data.error, 'alert')
    }
    
    
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification notification={notification} />
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
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title: <input 
          value={newTitle} 
          onChange={({ target }) => setNewTitle(target.value)} />
        </div>
        <div>author: <input 
          value={newAuthor} 
          onChange={({ target }) => setNewAuthor(target.value)} />
        </div>
        <div>url: <input 
          value={newURL} 
          onChange={({ target }) => setNewURL(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
