import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from '../components/BlogForm';

test('calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = jest.fn();
  render(<BlogForm createBlog={createBlog} />);
  const user = userEvent.setup();

  const titleInput = screen.getByPlaceholderText('Title');
  const authorInput = screen.getByPlaceholderText('Author');
  const urlInput = screen.getByPlaceholderText('URL');
  const createButton = screen.getByText('create');

  await user.type(titleInput, 'Test Blog Title');
  await user.type(authorInput, 'Test Author');
  await user.type(urlInput, 'http://testurl.com');
  await user.click(createButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
  });
});
