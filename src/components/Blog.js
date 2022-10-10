import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlogWithId }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailedView, setDetailedView] = useState(false)

  const toggleDetailedView = () => {
    setDetailedView(!detailedView)
  }

  const addLike = (event) => {
    event.preventDefault()

    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    updateBlog(blog.id, updatedBlog)
  }

  const removeBlog = (event) => {
    event.preventDefault()

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogWithId(blog.id)
    }

  }

  const permissionToDelete = () => {
    const loggedBlogappUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
    if (loggedBlogappUser) {
      return loggedBlogappUser.username === blog.user.username
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div>{blog.title} {blog.author}</div>
      <button onClick={toggleDetailedView}>{detailedView ? 'hide' : 'view'}</button>
      {detailedView ?
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={addLike}>like</button></div>
          <div>{blog.user.name}</div>
          {permissionToDelete() ?
            <button onClick={removeBlog}>remove</button> :
            <></>}
        </div>
        : <></>}
    </div>
  )
}

export default Blog