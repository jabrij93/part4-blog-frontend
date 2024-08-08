import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test by jabs',
    likes: 0,
    user: { username: 'testuser' }
  };

  const { container } = render(<Blog blog={blog} />);

  const blogTitle = container.querySelector('.blog-title');
  expect(blogTitle).toHaveTextContent('Component testing is done with react-testing-library');

  const blogAuthor = container.querySelector('.blog-author');
  expect(blogAuthor).toHaveTextContent('test by jabs');
});

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'test by jabs',
    likes: 0,
    user: { username: 'testuser' }
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog}  />);

  const user = userEvent.setup();
  const button = screen.getByText('show');
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
