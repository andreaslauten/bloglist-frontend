import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders the blogs title and author, not the url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testauthor',
    likes: 24,
    url: 'localhost/blog'
  }

  render(<Blog blog={blog}/>)

  const titleAuthorElement = screen.getByText('Component testing is done with react-testing-library Testauthor')
  const likesElement = screen.queryByText('24')
  const urlElement = screen.queryByText('localhost/blog')
  expect(titleAuthorElement).toBeDefined()
  expect(likesElement).toBeNull
  expect(urlElement).toBeNull
})

test('url and likes are shown when button is pressed', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testauthor',
    likes: 24,
    url: 'localhost/blog',
    user: {
      name: 'Testname'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likesElement = screen.getByText('likes 24')
  const urlElement = screen.getByText('localhost/blog')
  console.log(likesElement)
  console.log(urlElement)
  expect(likesElement).toBeDefined()
  expect(urlElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testauthor',
    likes: 24,
    url: 'localhost/blog',
    user: {
      name: 'Testname'
    }
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateBlog={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})