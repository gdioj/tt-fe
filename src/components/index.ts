// Central exports for all components
// This file provides a clean way to import components from their organized folders

// Layout components
export { AppSidebar } from './layout/app-sidebar';

// Authentication components
export { default as ProtectedRoute } from './auth/protected-route';
export { LogoutButton } from './auth/logout-button';

// Data components
export { DataTable } from './data/data-table';

// Theme components
export { ThemeProvider } from './theme/theme-provider';
export { ThemeSwitcher } from './theme/theme-switcher';

// Employee components
export { AddEmployeeModal } from './employees/add-employee-modal';
export { EmployeesTable } from './employees/employees-table';
export { columns as employeeColumns } from './employees/columns';

// UI Components - re-export for convenience
export * from './ui/avatar';
export * from './ui/badge';
export * from './ui/button';
export * from './ui/calendar';
export * from './ui/card';
export * from './ui/date-picker';
export * from './ui/dialog';
export * from './ui/dropdown-menu';
export * from './ui/input';
export * from './ui/number-range';
export * from './ui/popover';
export * from './ui/separator';
export * from './ui/sheet';
export * from './ui/sidebar';
export * from './ui/skeleton';
export * from './ui/table';
export * from './ui/tooltip';
