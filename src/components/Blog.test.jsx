import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library'
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )

  // const element = screen.getByText((content, element) => element.tagName.toLowerCase() === 'p' && content.includes('Component testing is done with react-testing-library'))
  // const element = screen.getByText((content, element) => content.includes('Component testing is done with react-testing-library'))
  // expect(element).toBeDefined()
})