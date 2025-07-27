import { formatCurrency, formatNumber, formatDate } from '../lib/formatters';

// Test the formatters
console.log('Testing formatCurrency:');
console.log(formatCurrency(1234567.89)); // Should output: ₱1,234,567.89
console.log(formatCurrency(500)); // Should output: ₱500.00
console.log(formatCurrency(0)); // Should output: ₱0.00
console.log(formatCurrency(null)); // Should output: ₱0.00

console.log('\nTesting formatNumber:');
console.log(formatNumber(1234567.89)); // Should output: 1,234,567.89
console.log(formatNumber(500)); // Should output: 500.00
console.log(formatNumber(0)); // Should output: 0.00

console.log('\nTesting formatDate:');
console.log(formatDate('2024-01-15')); // Should output: January 15, 2024
console.log(formatDate('2023-12-25')); // Should output: December 25, 2023
console.log(formatDate(null)); // Should output: N/A

// Test with sample employee data
const sampleEmployee = {
  uid: '1',
  first_name: 'John',
  last_name: 'Doe',
  employment_date: '2023-06-15',
  daily_rate: 1500.50
};

console.log('\nSample Employee Data Formatting:');
console.log(`Name: ${sampleEmployee.first_name} ${sampleEmployee.last_name}`);
console.log(`Employment Date: ${formatDate(sampleEmployee.employment_date)}`);
console.log(`Daily Rate: ${formatCurrency(sampleEmployee.daily_rate)}`);
