# Contributing to Strapi Plugin Component Usage

Thank you for your interest in contributing! We welcome contributions from the community.

## 🐛 Reporting Bugs

Before submitting a bug report:

1. **Search existing issues** to avoid duplicates
2. **Use the latest version** of the plugin
3. **Provide details**:
   - Clear description of the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details:
     - Strapi version
     - Plugin version
     - Node.js version
     - Operating system

## 💡 Feature Requests

We love new ideas! To suggest a feature:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case** - why is it valuable?
4. **Provide examples** - how would it work?

## 🔧 Pull Requests

### Before You Start

1. **Open an issue first** to discuss major changes
2. **Fork the repository**
3. **Create a feature branch** from `main`

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/strapi-plugin-component-usage.git
cd strapi-plugin-component-usage

# Install dependencies
npm install

# Link to a Strapi project for testing
npm link
cd /path/to/test-strapi-project
npm link strapi-plugin-component-usage
```

### Code Guidelines

- **Follow existing code style**
- **Use ESLint** (if configured)
- **Write clear commit messages**
- **Comment complex logic**
- **Keep functions small and focused**
- **Use Strapi Design System components**
- **Test your changes**

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(ui): add component relationship visualization
fix(api): prevent deletion of components in use
docs(readme): update installation instructions
```

### Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly**:
   - Test in a fresh Strapi project
   - Test with different Strapi versions (if applicable)
   - Test edge cases
3. **Create the PR** with:
   - Clear title
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots/GIFs for UI changes
4. **Respond to feedback** promptly
5. **Squash commits** if requested

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help create a welcoming environment

## ❓ Questions

If you have questions:

1. Check the [README](README.md)
2. Search [existing issues](https://github.com/yourusername/strapi-plugin-component-usage/issues)
3. Open a new issue with the `question` label

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing!** 🎉
