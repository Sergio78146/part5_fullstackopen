import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          <button onClick={() => handleRemove(blog)}>remove</button>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default Blog;
