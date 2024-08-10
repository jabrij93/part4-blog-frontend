import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    // The event handler is a mock function defined with Vitest:
    const createBlog = vi.fn()

    // A session is started to interact with the rendered component:
    const user = userEvent.setup()
    
    render(<BlogForm createBlog={createBlog} />)

    // Select input fields using the labels
    const titleInput = screen.getByPlaceholderText('title');
    const authorInput = screen.getByPlaceholderText('author');
    const urlInput = screen.getByPlaceholderText('url');
    const likesInput = screen.getByPlaceholderText('likes');
    const sendButton = screen.getByText('add');

    // Simulate user typing into input fields
    await user.type(titleInput, 'Testing Title')
    await user.type(authorInput, 'Testing Author')
    await user.type(urlInput, 'http://consistency_leads_to_conviction.com')
    await user.type(likesInput, '100') // Pass as a string

    // Simulate form submission
    await user.click(sendButton)
  
    // Check that createBlog was called once with the correct data
    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing Title',
      author: 'Testing Author',
      url: 'http://consistency_leads_to_conviction.com',
      likes: 100,
    })
  })