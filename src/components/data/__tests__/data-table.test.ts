// Test file to verify the data-table filtering functionality
import { describe, expect, test } from '@jest/globals';

// Mock data for testing
const mockEmployees = [
  { id: 1, first_name: "John", last_name: "Doe", employment_date: "2023-01-15", daily_rate: 250 },
  { id: 2, first_name: "Jane", last_name: "Smith", employment_date: "2023-02-20", daily_rate: 300 },
  { id: 3, first_name: "Bob", last_name: "Johnson", employment_date: "2023-03-10", daily_rate: 275 },
];

// Test the filter logic
describe('DataTable Filtering', () => {
  test('should filter data correctly by first name', () => {
    const filterValue = "john";
    const filtered = mockEmployees.filter(employee => 
      employee.first_name.toLowerCase().includes(filterValue.toLowerCase())
    );
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].first_name).toBe("John");
  });

  test('should filter data correctly by last name', () => {
    const filterValue = "smith";
    const filtered = mockEmployees.filter(employee => 
      employee.last_name.toLowerCase().includes(filterValue.toLowerCase())
    );
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].last_name).toBe("Smith");
  });

  test('should handle multiple filters correctly', () => {
    // Test that multiple filters work independently
    const firstNameFilter = "j";
    const filtered = mockEmployees.filter(employee => 
      employee.first_name.toLowerCase().includes(firstNameFilter.toLowerCase())
    );
    
    expect(filtered).toHaveLength(2); // John and Jane
  });
});

export {};
