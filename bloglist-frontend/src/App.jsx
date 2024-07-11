import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/loginService';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
      blogService.setToken(user.token);
      blogService.getAll().then((blogs) => setBlogs(blogs));
      setNotification('Login successful');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setNotification('Wrong credentials');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    setBlogs([]);
    setNotification('Logout successful');
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const savedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(savedBlog));
      setNotification(`A new blog "${savedBlog.title}" by ${savedBlog.author} added`);
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setNotification('Failed to add blog');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id);
    const updatedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      const returnedBlog = await blogService.update(id, updatedBlog);
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog));
    } catch (exception) {
      setNotification('Failed to like blog');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <Notification message={notification} />
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
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
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={handleLike} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
