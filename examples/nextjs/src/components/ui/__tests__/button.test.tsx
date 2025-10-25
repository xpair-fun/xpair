import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with default variant', () => {
    const { container } = render(<Button>Default Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-primary')
  })

  it('renders with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-secondary')
  })

  it('renders with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline Button</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('border')
  })

  it('renders with different sizes', () => {
    const { container, rerender } = render(<Button size="sm">Small</Button>)
    let button = container.querySelector('button')
    expect(button).toHaveClass('h-9')

    rerender(<Button size="lg">Large</Button>)
    button = container.querySelector('button')
    expect(button).toHaveClass('h-11')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })
})
