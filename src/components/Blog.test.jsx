import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { exact } from 'prop-types';

describe('<Blog /> testing the togglable component', () => {
  const blog = {
    id: '669e85172ab0961233943563',
    author: 'By jabs',
    title: 'testing library',
    likes: 1000,
    url: 'www.consistency_leads_to_conviction.com'
  };

  const mockHandler = vi.fn();

  let container;

  beforeEach(() => {
    container = render(
      <Blog blog={blog} buttonLabel="show" updatedLike={mockHandler} >
        <div>testing library</div>
      </Blog>
    ).container;
  });

  // option 1
  test('renders its children', async () => {
    await screen.findAllByText('Title: testing library');
  });

  // option 2
  test('renders its children', async () => {
    await screen.findAllByText((content, element) => {
      return element.textContent.includes('testing library');
    });
  });

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent');
    expect(div).toHaveStyle('display: none');
  });

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('show');
    await user.click(button);

    const div = container.querySelector('.togglableContent');
    expect(div).not.toHaveStyle('display: none');

    // Check if the likes and URL are displayed
    expect(screen.findAllByText((content, element) => {
      return element.textContent.includes('likes: 1000');
    }));
    expect(screen.findAllByText((content, element) => {
      return element.textContent.includes('consistency');
    }));
  });

  test('clicking the button calls event handler twice', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('like');

    // click two times
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

// test('renders content', () => {
//   const blog = {
//     title: 'Component testing is done with react-testing-library',
//     author: 'Test by jabs'
//   };

//   const { container } = render(<Blog blog={blog} />);

//   const blogTitle = container.querySelector('.blog-title');
//   expect(blogTitle).toHaveTextContent('Component testing is done with react-testing-library', {exact: true});

//   const blogAuthor = container.querySelector('.blog-author');
//   expect(blogAuthor).toHaveTextContent('test', {exact: false});
// });

// test('clicking the button calls event handler once', async () => {
//   const blog = {
//     title: 'Component testing is done with react-testing-library',
//     author: 'test by jabs',
//     likes: 0,
//     user: { username: 'testuser' }
//   };

//   const mockHandler = vi.fn();

//   render(<Blog blog={blog}  />);

//   const user = userEvent.setup();
//   const button = screen.getByText('show');
//   await user.click(button);

//   expect(mockHandler.mock.calls).toHaveLength(1);
// });
