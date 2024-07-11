import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../components/Blog';

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 0,
  user: {
    name: 'Test User'
  }
};

test('renders title and author but not url or likes by default', () => {
  render(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />);
  
  expect(screen.getByText('Test Blog Title Test Author')).toBeInTheDocument();
  expect(screen.queryByText('http://testurl.com')).not.toBeInTheDocument();
  expect(screen.queryByText('likes')).not.toBeInTheDocument();
});

test('renders url and likes when the view button is clicked', async () => {
  render(<Blog blog={blog} handleLike={() => {}} handleRemove={() => {}} />);
  const user = userEvent.setup();

  const button = screen.getByText('view');
  await user.click(button);

  expect(screen.getByText('http://testurl.com')).toBeInTheDocument();
  expect(screen.getByText('likes 0')).toBeInTheDocument();
});

test('calls the like button event handler twice when like is clicked twice', async () => {
  const mockHandler = jest.fn();
  render(<Blog blog={blog} handleLike={mockHandler} handleRemove={() => {}} />);
  const user = userEvent.setup();

  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('like');
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
