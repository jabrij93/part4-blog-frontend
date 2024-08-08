import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const Blog = forwardRef(({ blog, updatedLike, blogId, loggedInUsername }, refs) => {
  const [likes, setLikes] = useState(blog.likes);
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => ({
    toggleVisibility
  }));

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  useEffect(() => {
    setLikes(blog.likes);
  }, [blog.likes]);

  const addLike = () => {
    updatedLike(blog.id, { ...blog, likes: likes + 1 });
  };

  const onDelete = () => {
    blogId(blog.id);
  };

  const showDeleteButton = loggedInUsername && blog.user.username === loggedInUsername;

  return (
    <div>
      <div style={blogStyle}>
        <div style={{ display: 'inline-flex' }} className='blog-title'>
          <p style={{ marginRight: '10px', marginBottom: '0' }}>Title: {blog.title}</p>
          <button onClick={toggleVisibility}>show</button>
        </div>
        <div style={showWhenVisible}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex' }} className='blog-author'>
                <p>Author: {blog.author}</p>
                <button onClick={toggleVisibility}>hide</button>
              </div>
              <div style={{ display: 'flex' }}>
                <p>Likes: {likes}</p>
                <button onClick={addLike}>like</button>
              </div>
              <p>Url: {blog.url}</p>
              {showDeleteButton && <button onClick={onDelete}>delete</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Blog;
