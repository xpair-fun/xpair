import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card'

describe('Card Components', () => {
  it('renders Card component with children', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>
    )
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders CardHeader with title and description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('renders CardContent with children', () => {
    render(
      <Card>
        <CardContent>
          <p>Content text</p>
        </CardContent>
      </Card>
    )
    expect(screen.getByText('Content text')).toBeInTheDocument()
  })

  it('renders CardFooter with children', () => {
    render(
      <Card>
        <CardFooter>
          <button>Footer Button</button>
        </CardFooter>
      </Card>
    )
    expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument()
  })

  it('applies custom className to Card', () => {
    const { container } = render(
      <Card className="custom-class">
        <div>Content</div>
      </Card>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
