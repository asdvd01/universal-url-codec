# Contributing to Universal URL Codec

First off, thank you for considering contributing to Universal URL Codec! It's people like you that make this library better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by a code of respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** - Include code snippets that demonstrate the issue
- **Describe the behavior you observed** and what behavior you expected
- **Include your environment details** (Node.js version, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Include code examples** if applicable
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes:
   - Write or update tests as needed
   - Update documentation if necessary
   - Ensure all tests pass: `npm test`
   - Check code style: `npm run lint`

4. Commit your changes:
   ```bash
   git commit -m "Add: brief description of your changes"
   ```
   
   Follow these commit message conventions:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Docs:` for documentation changes
   - `Test:` for test-related changes
   - `Refactor:` for code refactoring

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request with:
   - A clear title and description
   - Reference to any related issues
   - Screenshots or examples if applicable

## Development Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/universal-url-codec.git
   cd universal-url-codec
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Run tests with coverage:**
   ```bash
   npm run test:coverage
   ```

5. **Build the project:**
   ```bash
   npm run build
   ```

6. **Run linter:**
   ```bash
   npm run lint
   ```

## Project Structure

```
universal-url-codec/
├── src/
│   ├── index.ts          # Main library code
│   └── index.test.ts     # Test suite
├── dist/                 # Compiled output (generated)
├── examples.ts           # Usage examples
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Provide type definitions for all public APIs
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### Testing

- Write tests for all new features
- Maintain or improve code coverage (90%+)
- Test edge cases and error conditions
- Include tests for different character encodings

### Code Style

- Follow the existing code style
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Run `npm run lint` before committing

## Testing Guidelines

### What to Test

1. **Basic functionality** - Does it work as expected?
2. **Edge cases** - Empty strings, null, undefined, very long strings
3. **Unicode support** - Test with various languages (Chinese, Arabic, emoji, etc.)
4. **Error handling** - Test invalid inputs
5. **Options** - Test all configuration options
6. **Round-trip** - Ensure encode/decode cycles preserve data

### Example Test Structure

```typescript
describe('feature name', () => {
  it('should handle basic case', () => {
    expect(myFunction('input')).toBe('expected');
  });

  it('should handle edge case', () => {
    expect(myFunction('')).toBe('');
  });

  it('should handle Unicode', () => {
    expect(myFunction('你好')).toBe('expected');
  });

  it('should throw on invalid input', () => {
    expect(() => myFunction(null as any)).toThrow(TypeError);
  });
});
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update examples.ts with usage examples
- Update CHANGELOG.md following Keep a Changelog format

## Questions?

Feel free to open an issue with your question, or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
