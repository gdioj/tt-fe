# Code Standards and Formatting Guide

This project uses **ESLint** and **Prettier** to maintain consistent code quality and formatting standards.

## 🛠️ Setup

### Required VSCode Extensions

To get the best development experience, install these extensions:

```bash
# Essential extensions
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

### Configuration Files

- **`.prettierrc`** - Prettier formatting rules
- **`.prettierignore`** - Files to ignore during formatting
- **`eslint.config.mjs`** - ESLint linting rules (Modern flat config)
- **`.vscode/settings.json`** - VSCode workspace settings

## 📋 Available Scripts

```bash
# Linting
pnpm lint              # Run ESLint
pnpm lint:check        # Run ESLint with zero warnings tolerance
pnpm lint:fix          # Fix auto-fixable ESLint issues
pnpm lint:strict       # Strict linting with unused disable directives

# Formatting
pnpm format            # Format all files with Prettier
pnpm format:check      # Check if files are formatted correctly
pnpm format:fix        # Format files with warnings

# Combined
pnpm check             # Run both lint:check and format:check
pnpm fix               # Run both lint:fix and format:fix
```

## 🎯 Code Standards

### ESLint Rules (Globally Acknowledged Standards)

#### TypeScript
- **No unused variables** - Variables prefixed with `_` are ignored
- **Consistent type imports** - Use `import type` for type-only imports
- **Array type consistency** - Use `string[]` instead of `Array<string>`
- **Interface over type** - Prefer `interface` over `type` for object definitions

#### React
- **JSX key prop** - Required for list items
- **Hooks rules** - Proper hooks usage and dependency arrays
- **Self-closing components** - Use self-closing tags when possible
- **Fragment syntax** - Use `<>` instead of `<React.Fragment>`
- **Boolean props** - Avoid explicit `={true}` for boolean props

#### Code Quality
- **Complexity limit** - Functions should not exceed complexity of 10
- **Function length** - Functions should not exceed 50 lines
- **Max parameters** - Functions should not have more than 3 parameters
- **Magic numbers** - Avoid magic numbers (except 0, 1, -1)

#### Accessibility (a11y)
- **Alt text** - Images must have alt attributes
- **ARIA props** - Proper ARIA attributes usage
- **Label association** - Form controls must have associated labels
- **Keyboard navigation** - Interactive elements must be keyboard accessible

#### Import Organization
```typescript
// 1. Node modules
import React from 'react';
import { NextPage } from 'next';

// 2. Internal imports
import { Button } from '@/components/ui/button';
import { Employee } from '@/models';

// 3. Relative imports
import './styles.css';
```

### Prettier Rules (Industry Standards)

```json
{
  "semi": true,                    // Always use semicolons
  "trailingComma": "es5",         // Trailing commas where valid in ES5
  "singleQuote": true,            // Use single quotes
  "printWidth": 80,               // 80 character line length
  "tabWidth": 2,                  // 2 spaces for indentation
  "useTabs": false,               // Use spaces, not tabs
  "endOfLine": "lf",              // Unix line endings
  "arrowParens": "always",        // Always parentheses around arrow function params
  "bracketSpacing": true,         // Spaces in object literals
  "bracketSameLine": false        // Put > on new line in JSX
}
```

## 🔧 VSCode Integration

The project is configured to:

- **Format on save** - Automatically format files when saving
- **Fix on save** - Auto-fix ESLint issues when saving
- **Organize imports** - Sort and organize imports on save
- **Show lint errors** - Display ESLint errors in Problems panel

## 🚀 Pre-commit Workflow

Before committing code, run:

```bash
pnpm check  # Verify linting and formatting
pnpm fix    # Auto-fix issues
```

## 📝 Best Practices

### TypeScript
- Use explicit return types for public APIs
- Prefer `const` assertions for literal types
- Use `unknown` instead of `any` when possible
- Leverage discriminated unions for type safety

### React
- Use functional components with hooks
- Extract custom hooks for reusable logic
- Memoize expensive calculations with `useMemo`
- Use `useCallback` for stable function references

### Performance
- Avoid inline objects and functions in JSX
- Use proper dependency arrays in hooks
- Implement proper error boundaries
- Optimize bundle size with dynamic imports

### Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers

## 🔍 Troubleshooting

### ESLint Issues
```bash
# Clear ESLint cache
pnpm lint --cache-file .eslintcache

# Debug ESLint configuration
pnpm lint --debug
```

### Prettier Issues
```bash
# Check what files Prettier would format
pnpm format:check

# Debug Prettier configuration
npx prettier --check . --debug-check
```

### VSCode Issues
1. Reload VSCode window: `Ctrl+Shift+P` → "Developer: Reload Window"
2. Check extension status in Extensions panel
3. Verify workspace settings in `.vscode/settings.json`

## 📚 Resources

- [ESLint Rules Documentation](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [JSX a11y Plugin](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
