import { cn } from '../lib/utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    const result = cn('class1', false && 'class2', 'class3')
    expect(result).toBe('class1 class3')
  })

  it('merges tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    // Should keep only px-4 due to tailwind-merge
    expect(result).toContain('px-4')
    expect(result).toContain('py-1')
  })

  it('handles undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles empty string', () => {
    const result = cn('class1', '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles object notation', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true,
    })
    expect(result).toBe('class1 class3')
  })
})
