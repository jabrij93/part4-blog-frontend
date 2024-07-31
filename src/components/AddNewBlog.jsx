import { useState } from 'react'

const AddNewBlog = ( { createBlog }) => {
    const [newLike, setNewLikes] = useState('')
    const [newTitle, setNewTitles] = useState('')
    const [newAuthor, setNewAuthors] = useState('')
    const [newUrl, setNewUrls] = useState('')
    const [notifications, setNotifications] = useState(null)
    
    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
          title: newTitle,
          author: newAuthor,
          url: newUrl,
          likes: newLike === undefined ? 0 : Number(newLike) 
        })
        setNewTitles('')
        setNewAuthors('')
        setNewUrls('')
        setNewLikes('')
    }

    return (
      <div>
        <form onSubmit={addBlog}>
            <div>
                title: <input 
                onChange={event=> setNewTitles(event.target.value)} value={newTitle} />
            </div>
            <div>
                author: <input 
                onChange={event=> setNewAuthors(event.target.value)} value={newAuthor} />
            </div>
            <div>
                url: <input 
                onChange={event=> setNewUrls(event.target.value)} value={newUrl} />
            </div>
            <div>
                likes: <input 
                onChange={event=> setNewLikes(event.target.value)} value={newLike} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
      </div>
    )
}
  
export default AddNewBlog