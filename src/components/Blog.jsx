import React from 'react';
import { useState } from 'react'

const Blog = ({ blog, toggleImportance, index, id, updatedLike }) => {
  const [likes, setLikes] = useState(blog.likes)
  console.log("INSPECT LIKES", likes)
  
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const blogStyleWithBlock = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    display: 'block'
  }

  // const inlineBlock = {
  //   display: 'block'
  // }

  // const label = blog.important ? 'make not important' : 'make important'
  const buttonStyle = {
    marginLeft: '10px',
  };

  const addLike = () => {
    updatedLike(blog.id, { ...blog, likes: likes + 1 })
  }


  return (
    <div>
      <div style={ blogStyle }>
        <div style={{ display: 'inline-flex' }}>
          <p style={{ marginRight: '10px', marginBottom: '0'}}> Title: {blog.title} </p> <button onClick={toggleVisibility}> view </button>
        </div>
        <div style={showWhenVisible}> 
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{display: 'inline-flex'}}>
                <p> Author: {blog.author} </p>
                <button onClick={toggleVisibility} > hide </button>
                </div>
              
                <div style={{display: 'flex'}}>
                  <p> Likes: {blog.likes} </p>
                  <button onClick={addLike} > like </button>
                </div>

                <p> Url: {blog.url} </p>
              </div>
              
            </div>
        </div>
      </div>
      {/* <button onClick={toggleImportance}> {label} </button> */}
    </div>
  );
};

export default Blog;
