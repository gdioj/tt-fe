# Components Structure

This directory contains all React components organized by their functionality and purpose.

## Directory Structure

```
src/components/
├── index.ts                 # Central exports for all components
├── layout/                  # Layout-related components
│   ├── index.ts
│   └── app-sidebar.tsx
├── auth/                    # Authentication & authorization components
│   ├── index.ts
│   ├── logout-button.tsx
│   └── protected-route.tsx
├── data/                    # Data display and manipulation components
│   ├── index.ts
│   ├── data-table.tsx
│   └── __tests__/          # Tests and documentation for data components
│       ├── data-table-debug-guide.ts
│       ├── data-table-docs.ts
│       ├── data-table-number-filter-test.ts
│       └── data-table.test.ts
├── theme/                   # Theme and appearance components
│   ├── index.ts
│   ├── theme-provider.tsx
│   └── theme-switcher.tsx
├── employees/               # Employee-specific components
│   ├── index.ts
│   ├── add-employee-modal.tsx
│   ├── employees-table.tsx
│   └── columns.ts
└── ui/                      # Reusable UI primitives (based on shadcn/ui)
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── calendar.tsx
    ├── card.tsx
    ├── date-picker.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── number-range.tsx
    ├── popover.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── sidebar.tsx
    ├── skeleton.tsx
    ├── table.tsx
    └── tooltip.tsx
```

## Import Guidelines

### Using the Central Index
You can import components from the central index file:
```typescript
import { AppSidebar, DataTable, ThemeProvider } from '@/components';
```

### Using Category-Specific Imports
For better tree-shaking and explicit dependencies:
```typescript
import { AppSidebar } from '@/components/layout';
import { DataTable } from '@/components/data';
import { ProtectedRoute, LogoutButton } from '@/components/auth';
import { ThemeProvider, ThemeSwitcher } from '@/components/theme';
import { AddEmployeeModal, EmployeesTable } from '@/components/employees';
```

### Direct Imports
For specific use cases:
```typescript
import { AppSidebar } from '@/components/layout/app-sidebar';
import { DataTable } from '@/components/data/data-table';
```

## Component Categories

### Layout Components
Components that define the overall structure and navigation of the application.
- `AppSidebar`: Main navigation sidebar with user information and menu items

### Auth Components
Components related to authentication and authorization.
- `ProtectedRoute`: HOC that wraps pages requiring authentication
- `LogoutButton`: Button component for user logout functionality

### Data Components
Components for displaying and manipulating data.
- `DataTable`: Reusable table component with sorting, filtering, and pagination
- Tests and documentation are in the `__tests__` folder

### Theme Components
Components for managing application appearance and themes.
- `ThemeProvider`: Context provider for theme management
- `ThemeSwitcher`: UI component for switching between themes

### Employee Components
Domain-specific components for employee management.
- `AddEmployeeModal`: Modal for adding new employees
- `EmployeesTable`: Specialized table for displaying employee data
- `columns.ts`: Column definitions for employee tables

### UI Components
Low-level, reusable UI primitives based on shadcn/ui.
These are typically used as building blocks for higher-level components.

## Best Practices

1. **Import from the most specific level**: Use category-specific imports when possible for better tree-shaking
2. **Keep components focused**: Each component should have a single responsibility
3. **Use TypeScript**: All components should be properly typed
4. **Document complex components**: Add JSDoc comments for complex or public APIs
5. **Test data components**: Data manipulation components should have tests in the `__tests__` folder
6. **Follow naming conventions**: Use PascalCase for component names and kebab-case for file names

## Adding New Components

When adding new components:

1. Choose the appropriate category folder (or create a new one if needed)
2. Create the component file with proper TypeScript typing
3. Add the export to the category's `index.ts` file
4. Add the export to the main `components/index.ts` file
5. Add tests if the component involves data manipulation or complex logic
6. Update this README if you create a new category

## Services Integration

Components should use the service layer for API calls instead of direct Supabase queries:

```typescript
// ✅ Good - Using service layer
import { EmployeeService } from '@/services';

const employees = await EmployeeService.getAll();

// ❌ Bad - Direct API calls in components
const { data } = await supabase.from('employees').select('*');
```

See `src/services/README.md` for more information about the service layer.
