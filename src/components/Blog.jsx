import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const Blog = forwardRef(({ blog, updatedLike, blogId, loggedInUsernameID, buttonLabel}, refs) => {
  const [likes, setLikes] = useState(blog.likes);
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const blogContainer = { display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }

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

  const showDeleteButton = loggedInUsernameID && blog.user === loggedInUsernameID;

  console.log('Blog:', blog);
  console.log('Blog user:', blog.user.id);
  console.log('Logged-in username:', loggedInUsernameID);
  console.log("showDeleteButton:", showDeleteButton);

  return (
    <div>
      <div style={blogStyle} className='blog'>
          <p style={{ marginRight: '10px', marginBottom: '0' }}>
            Title: {blog.title} 
            <button onClick={toggleVisibility} >{buttonLabel}</button>
          </p>
        <div style={visible ? blogContainer : showWhenVisible} className='togglableContent'>
            <div>
              <p>Author: {blog.author} <button onClick={toggleVisibility}>hide</button> </p>
            </div>
            <div>
              <p>Likes: {likes} <button onClick={addLike}>like</button> </p>
            </div>
            <div>
              <p>Url: {blog.url}</p>
            </div>
            <div>
              {console.log('showDeleteButton:', showDeleteButton)}
              {showDeleteButton && <button onClick={onDelete}>delete</button>}
            </div>
        </div>
      </div>
    </div>
  );
});

export default Blog;
