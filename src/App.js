import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import CreateBlogForm from './components/CreateBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

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

  const blogsSortedByLikes = () => {
    const blogsSorted = [...blogs].sort((a, b) => b.likes - a.likes )

    return blogsSorted.map(blog => 
      <Blog 
        key={blog.id} 
        blog={blog} 
        updateBlog={updateBlog}
        removeBlogWithId={removeBlogWithId}        
      />
    )
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${blogObject.title} by ${blogObject.author} added`)

      createBlogFormRef.current.toggleVisibility()

    } catch (exception) {
      notify(exception.response.data.error, 'alert')
    }
  }

  const updateBlog = async (blogId, newBlog) => {
    try {
      const updatedBlog = await blogService.update(blogId, newBlog)
      const updatedBlogs = blogs.map(blog => (
        blog.id === blogId ? updatedBlog : blog
      ))
      setBlogs(updatedBlogs)
      
    } catch (exception) {
      notify(exception.response.data.error, 'alert')
    }
  }

  const removeBlogWithId = async (blogId) => {
    try {
      const response = await blogService.remove(blogId)
      console.log(response)
      const updatedBlogs = blogs.filter(blog => blog.id !== blogId)
      setBlogs(updatedBlogs)
      
    } catch (exception) {
      notify(exception)
    }
  }

  const createBlogFormRef = useRef()

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
      <Togglable buttonLabel="create new blog" ref={createBlogFormRef}>
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>
      {blogsSortedByLikes()}
    </div>
  )
}

export default App
