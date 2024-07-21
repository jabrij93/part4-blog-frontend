const AddNewBlog = ({handleTitleChange, handleAuthorChange, handleUrlChange, handleLikeChange, addBlog, newTitle, newAuthor, newUrl, newLike}) => {
    return (
      <div>
        <form onSubmit={addBlog}>
            <div>
                title: <input onChange={handleTitleChange} value={newTitle} />
            </div>
            <div>
                author: <input onChange={handleAuthorChange} value={newAuthor} />
            </div>
            <div>
                url: <input onChange={handleUrlChange} value={newUrl} />
            </div>
            <div>
                likes: <input onChange={handleLikeChange} value={newLike} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
      </div>
    )
  }
  
export default AddNewBlog