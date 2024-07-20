const Blog = ({ blog, toggleImportance }) => {
    // const label = blog.important ? 'make not important' : 'make important'
    console.log("BLOG", blog);

    return (
      <div>
        <p> Title : {blog.title} </p>
        <p> Author : {blog.author} </p>
        <p> Likes : {blog.likes} </p>
        <p> Url : {blog.author} </p>
        
        {/* <button onClick={toggleImportance}> {label} </button> */}
      </div>
    )
  }
  
  export default Blog