# Contributing to xpair

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/x402api.git
   cd x402api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run in development mode**:
   ```bash
   npm run dev
   ```

## Project Structure

```
x402api/
├── src/
│   ├── components/      # React UI components
│   ├── context/         # React context and providers
│   ├── core/           # Core x402 client implementation
│   ├── hooks/          # React hooks
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── constants/      # Constants and configuration
├── examples/
│   └── nextjs/         # Example Next.js application
└── dist/               # Built output (generated)
```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update types as needed

3. **Type check**:
   ```bash
   npm run type-check
   ```

4. **Build and test**:
   ```bash
   npm run build
   ```

5. **Test with the example app**:
   ```bash
   cd examples/nextjs
   npm install
   npm run dev
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

## Commit Message Guidelines

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add support for custom RPC endpoints
fix: resolve token balance display issue
docs: update installation instructions
```

## Code Style

- Use TypeScript for all new code
- Follow existing formatting patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use async/await over promises

## Adding New Features

### Adding a New Component

1. Create component file in `src/components/`:
   ```tsx
   // src/components/YourComponent.tsx
   import React from 'react';

   export interface YourComponentProps {
     // Define props
   }

   export const YourComponent: React.FC<YourComponentProps> = (props) => {
     // Implementation
   };
   ```

2. Export from `src/components/index.ts`:
   ```ts
   export * from './YourComponent';
   ```

3. Export from main `src/index.ts`

4. Update TypeScript types in `src/types/index.ts`

5. Add example usage to example app

### Adding a New Hook

1. Create hook file in `src/hooks/`:
   ```ts
   // src/hooks/useYourHook.ts
   import { useState, useEffect } from 'react';

   export const useYourHook = () => {
     // Implementation
   };
   ```

2. Export from `src/hooks/index.ts`

3. Export from main `src/index.ts`

4. Document usage in README

## Testing

Currently, the project uses manual testing with the example application. Future contributions for automated testing are welcome!

To test manually:
1. Build the library: `npm run build`
2. Link locally: `npm link`
3. In example app: `npm link xpair`
4. Test all functionality

## Documentation

When adding new features:

1. Update README.md with usage examples
2. Add JSDoc comments to public APIs
3. Update CHANGELOG.md
4. Update TypeScript types
5. Add examples to the example app

## Pull Request Process

1. **Ensure your code builds**:
   ```bash
   npm run build
   npm run type-check
   ```

2. **Update documentation**:
   - README.md
   - CHANGELOG.md
   - JSDoc comments
   - Type definitions

3. **Create a pull request**:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List breaking changes if any

4. **Respond to feedback**:
   - Address review comments
   - Make requested changes
   - Keep the PR up to date with main branch

## Release Process

Releases are managed by maintainers:

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag
4. Build and publish to npm

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the code
- Discussion about improvements

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

Thank you for contributing! 🎉
