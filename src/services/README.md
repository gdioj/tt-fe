/**
 * Services Layer Documentation
 * 
 * This directory contains all service classes that handle data operations and API calls.
 * Services provide a clean abstraction layer between UI components and data sources.
 * 
 * Benefits of using services:
 * - Centralized data logic
 * - Reusable across components
 * - Easier testing and mocking
 * - Consistent error handling
 * - Better separation of concerns
 * 
 * Structure:
 * /src/services/
 *   ├── index.ts              # Export all services
 *   ├── employee.service.ts   # Employee data operations
 *   └── [other].service.ts    # Future services
 * 
 * Usage Examples:
 * 
 * 1. Basic CRUD operations:
 *    ```typescript
 *    import { EmployeeService } from '@/services';
 * 
 *    // Get all employees
 *    const employees = await EmployeeService.getAll();
 * 
 *    // Get employee by ID
 *    const employee = await EmployeeService.getById('123');
 * 
 *    // Create new employee
 *    const newEmployee = await EmployeeService.create({
 *      first_name: 'John',
 *      last_name: 'Doe',
 *      employment_date: '2024-01-01',
 *      daily_rate: 250
 *    });
 * 
 *    // Update employee
 *    const updated = await EmployeeService.update('123', {
 *      daily_rate: 300
 *    });
 * 
 *    // Delete employee
 *    const success = await EmployeeService.delete('123');
 *    ```
 * 
 * 2. Complex operations with details:
 *    ```typescript
 *    // Create employee with additional details
 *    const result = await EmployeeService.createWithDetails({
 *      first_name: 'John',
 *      last_name: 'Doe',
 *      employment_date: '2024-01-01',
 *      daily_rate: 250,
 *      employee_details: [
 *        { id: '1', field: 'Phone', value: '123-456-7890' },
 *        { id: '2', field: 'Department', value: 'Engineering' }
 *      ]
 *    });
 * 
 *    if (result.success) {
 *      console.log('Employee created:', result.data);
 *    } else {
 *      console.error('Error:', result.error);
 *    }
 *    ```
 * 
 * 3. Search and filtering:
 *    ```typescript
 *    // Search by name
 *    const results = await EmployeeService.searchByName('john');
 * 
 *    // Filter by date range
 *    const newHires = await EmployeeService.getByDateRange(
 *      '2024-01-01', 
 *      '2024-12-31'
 *    );
 * 
 *    // Filter by salary range
 *    const highEarners = await EmployeeService.getByRateRange(300, 500);
 *    ```
 * 
 * Error Handling:
 * All service methods include proper error handling and logging.
 * Methods return appropriate types (null, empty arrays, or error objects)
 * to allow calling code to handle errors gracefully.
 * 
 * Migration Notes:
 * - Moved API calls from page components to services
 * - Server actions now use services instead of direct Supabase calls
 * - Maintained the same functionality with better organization
 * - All existing components continue to work without changes
 */

export {};
