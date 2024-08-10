import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()
  
    render(<BlogForm createBlog={createBlog} />)
  
    // Select input fields
    const titleInput = screen.getByText('title:')
    const authorInput = screen.getByText('author:')
    const urlInput = screen.getByText('url:')
    const likesInput = screen.getByText('likes:')
    const sendButton = screen.getByText('add')
  
    // Simulate user typing into input fields
    await user.type(titleInput, 'Testing Title')
    await user.type(authorInput, 'Testing Author')
    await user.type(urlInput, 'http://consistency_leads_to_conviction.com')
    await user.type(likesInput, 100)

    // Simulate form submission
    await user.click(sendButton)
  
    expect(createBlog.mock.calls).toHaveLength(1)
    // expect(createBlog.mock.calls[0][0]).toEqual({
    //   title: 'Testing Title',
    //   author: 'Testing Author',
    //   url: 'http://consistency_leads_to_conviction.com',
    //   likes: 100,
    // })
    expect(createBlog.mock.calls[0][0].content).toBe({
      title: 'Testing Title',
      author: 'Testing Author',
      url: 'http://consistency_leads_to_conviction.com',
      likes: 100,
    })
  })