# Setup and Publishing Guide

This guide will help you set up, develop, and publish the Universal URL Codec npm package.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Initial Setup

### 1. Clone or Initialize the Repository

```bash
# If starting from scratch
git init universal-url-codec
cd universal-url-codec

# Or clone your fork
git clone https://github.com/yourusername/universal-url-codec.git
cd universal-url-codec
```

### 2. Install Dependencies

```bash
npm install
```

This will install all development dependencies including:
- TypeScript
- Jest (testing framework)
- ESLint (linting)
- Type definitions

### 3. Verify Installation

```bash
# Run the simple verification test
node verify.js

# Run the full test suite (after npm install)
npm test

# Check code style
npm run lint

# Build the package
npm run build
```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Building the Package

```bash
# Compile TypeScript to JavaScript
npm run build

# Output will be in the dist/ directory
```

### Linting

```bash
# Check code style
npm run lint

# Many issues can be auto-fixed
npx eslint src/**/*.ts --fix
```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to `src/index.ts`

3. Update or add tests in `src/index.test.ts`

4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

5. Build the package:
   ```bash
   npm run build
   ```

6. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

## Publishing to NPM

### First-Time Setup

1. **Create an NPM account** at [npmjs.com](https://www.npmjs.com/signup)

2. **Login to NPM via CLI:**
   ```bash
   npm login
   ```

3. **Update package.json** with your information:
   ```json
   {
     "name": "universal-url-codec",
     "author": "Your Name <your.email@example.com>",
     "repository": {
       "type": "git",
       "url": "https://github.com/yourusername/universal-url-codec.git"
     }
   }
   ```

### Publishing Process

1. **Ensure all tests pass:**
   ```bash
   npm test
   ```

2. **Build the package:**
   ```bash
   npm run build
   ```

3. **Update version number** in `package.json`:
   ```json
   {
     "version": "1.0.0"  // Follow semantic versioning
   }
   ```

   Semantic Versioning (semver):
   - **MAJOR** (1.0.0 → 2.0.0): Breaking changes
   - **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
   - **PATCH** (1.0.0 → 1.0.1): Bug fixes

4. **Update CHANGELOG.md** with changes

5. **Test the package locally:**
   ```bash
   npm pack
   # This creates a .tgz file you can test with:
   # npm install ./universal-url-codec-1.0.0.tgz
   ```

6. **Publish to NPM:**
   ```bash
   npm publish
   ```

7. **Tag the release in Git:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### Publishing Updates

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm version patch

# For new features (1.0.0 → 1.1.0)
npm version minor

# For breaking changes (1.0.0 → 2.0.0)
npm version major

# Then publish
npm publish
```

## Project Structure

```
universal-url-codec/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── src/
│   ├── index.ts                # Main source code
│   └── index.test.ts           # Test suite
├── dist/                       # Compiled output (generated)
│   ├── index.js
│   └── index.d.ts
├── .eslintrc.js                # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .npmignore                  # NPM ignore rules
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # Contribution guidelines
├── jest.config.js              # Jest configuration
├── LICENSE                     # MIT License
├── package.json                # Package metadata
├── README.md                   # Documentation
├── SETUP.md                    # This file
├── tsconfig.json               # TypeScript configuration
├── examples.ts                 # Usage examples
└── verify.js                   # Quick verification script
```

## Common Issues and Solutions

### Issue: TypeScript compilation errors

**Solution:**
```bash
# Clear the build cache
rm -rf dist/
npm run build
```

### Issue: Tests failing

**Solution:**
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

### Issue: NPM publish fails

**Solution:**
1. Ensure you're logged in: `npm whoami`
2. Check if package name is available: `npm search universal-url-codec`
3. Ensure version number is incremented
4. Check .npmignore isn't excluding important files

### Issue: Import errors after publishing

**Solution:**
1. Ensure `dist/` is included in published package
2. Check `package.json` has correct `main` and `types` fields:
   ```json
   {
     "main": "dist/index.js",
     "types": "dist/index.d.ts"
   }
   ```

## Continuous Integration

The package includes GitHub Actions CI/CD configuration:

- **Automatic testing** on push/PR
- **Multi-version Node.js testing** (14.x, 16.x, 18.x, 20.x)
- **Code coverage reporting**
- **Automated publishing** on main branch (requires NPM_TOKEN secret)

### Setting up GitHub Actions NPM Publishing

1. Create an NPM access token:
   - Go to npmjs.com → Account Settings → Access Tokens
   - Generate a new "Automation" token

2. Add token to GitHub:
   - Repository Settings → Secrets → Actions
   - Create new secret: `NPM_TOKEN`
   - Paste your NPM token

## Testing Locally Before Publishing

```bash
# Create a test project
mkdir test-universal-url-codec
cd test-universal-url-codec
npm init -y

# Install from local package
npm install ../universal-url-codec

# Create a test file
cat > test.js << 'EOF'
const { encode, decode } = require('universal-url-codec');

console.log(encode('Hello World'));
console.log(encode('你好世界'));
console.log(decode('Hello%20World'));
EOF

# Run the test
node test.js
```

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/universal-url-codec/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/universal-url-codec/discussions)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

## Checklist Before Publishing

- [ ] All tests pass (`npm test`)
- [ ] Code coverage ≥ 90% (`npm run test:coverage`)
- [ ] No linting errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Version number updated in `package.json`
- [ ] CHANGELOG.md updated
- [ ] README.md updated (if needed)
- [ ] Tested locally with `npm pack`
- [ ] Git committed and pushed
- [ ] Ready to publish!

---

Happy coding! 🚀
