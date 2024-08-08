import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test by jabs'
  }

  const { container } = render(<Blog blog={blog} />)

  const blogTitle = container.querySelector('.blog-title')
  expect(blogTitle).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  const blogAuthor = container.querySelector('.blog-author')
  expect(blogAuthor).toHaveTextContent(
    'test by jabs'
  )

  // const element = screen.getByText((content, element) => element.tagName.toLowerCase() === 'p' && content.includes('Component testing is done with react-testing-library'))
  // const element = screen.getByText((content, element) => content.includes('Component testing is done with react-testing-library'))
  // expect(element).toBeDefined()
})