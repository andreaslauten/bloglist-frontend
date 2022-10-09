import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('clicking the create button calls the event handler with the right details', async () => {
  const createBlog = jest.fn()

  render(<CreateBlogForm createBlog={createBlog}/>)

  const user = userEvent.setup()

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'Testtitle')
  await user.type(inputs[1], 'Testauthor')
  await user.type(inputs[2], 'Testurl')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testtitle')
  expect(createBlog.mock.calls[0][0].author).toBe('Testauthor')
  expect(createBlog.mock.calls[0][0].url).toBe('Testurl')
})