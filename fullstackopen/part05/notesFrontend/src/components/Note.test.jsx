import { render, screen } from '@testing-library/react'
import Note from './Note'
import userEvent from '@testing-library/user-event'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // render(<Note note={note} />)
  // const element = screen.getByText('Component testing is done with react-testing-library')
  // expect(element).toBeDefined()

  // screen.debug(element) /*this print the HTML of a component to the terminal*/

  /*const { container } = render(<Note note={note} />)
  const div = container.querySelector('.note')
  expect(div).toHaveTextContent('Component testing is done with react-testing-library')*/

  const mockHandler = vi.fn()
  render(<Note note={note} toggleImportance={mockHandler} />)
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)
})