import { useState } from 'react';

const BlogForm = ( { createBlog }) => {
  const [newLike, setNewLikes] = useState('');
  const [newTitle, setNewTitles] = useState('');
  const [newAuthor, setNewAuthors] = useState('');
  const [newUrl, setNewUrls] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLike === undefined ? 0 : Number(newLike)
    });
    setNewTitles('');
    setNewAuthors('');
    setNewUrls('');
    setNewLikes('');
  };

  return (
    <div>
      <form onSubmit={addBlog}>
        <div>
                title: <input placeholder="title"
            onChange={event => setNewTitles(event.target.value)} value={newTitle} />
        </div>
        <div>
                author: <input placeholder="author"
            onChange={event => setNewAuthors(event.target.value)} value={newAuthor} />
        </div>
        <div>
                url: <input placeholder="url"
            onChange={event => setNewUrls(event.target.value)} value={newUrl} />
        </div>
        <div>
                likes: <input placeholder="likes"
            onChange={event => setNewLikes(event.target.value)} value={newLike} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;