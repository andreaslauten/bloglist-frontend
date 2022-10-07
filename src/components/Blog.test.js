import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders the blogs title and author, not the url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Testauthor',
    likes: 24,
    url: 'localhost/blog'
  }

  render(<Blog blog={blog}/>)

  const authorElement = screen.findByText('Testauthor')
  const titleElement = screen.findByText('Component testing is done with react-testing-library')
  const likesElement = screen.findByText('24')
  const urlElement = screen.findByText('localhost/blog')
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
  expect(likesElement).is({})
  expect(urlElement).is({})
})