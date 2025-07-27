import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate, formatNumber, formatPercentage } from "@/lib/formatters";

/**
 * Helper functions to create formatted columns for different data types
 */

/**
 * Creates a currency column with proper formatting and sorting
 */
export function createCurrencyColumn<T>(
  accessorKey: keyof T,
  header: string,
  currency = "₱"
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => formatCurrency(row.getValue(accessorKey as string), currency),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.getValue(accessorKey as string) as number;
      const valueB = rowB.getValue(accessorKey as string) as number;
      return (valueA || 0) - (valueB || 0);
    },
  };
}

/**
 * Creates a date column with proper formatting and sorting
 */
export function createDateColumn<T>(
  accessorKey: keyof T,
  header: string,
  dateOptions?: Intl.DateTimeFormatOptions
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => formatDate(row.getValue(accessorKey as string), "en-PH", dateOptions),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue(accessorKey as string));
      const dateB = new Date(rowB.getValue(accessorKey as string));
      return dateA.getTime() - dateB.getTime();
    },
  };
}

/**
 * Creates a number column with proper formatting and sorting
 */
export function createNumberColumn<T>(
  accessorKey: keyof T,
  header: string,
  decimals = 2
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => formatNumber(row.getValue(accessorKey as string), decimals),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.getValue(accessorKey as string) as number;
      const valueB = rowB.getValue(accessorKey as string) as number;
      return (valueA || 0) - (valueB || 0);
    },
  };
}

/**
 * Creates a percentage column with proper formatting and sorting
 */
export function createPercentageColumn<T>(
  accessorKey: keyof T,
  header: string,
  decimals = 1
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => formatPercentage(row.getValue(accessorKey as string), decimals),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.getValue(accessorKey as string) as number;
      const valueB = rowB.getValue(accessorKey as string) as number;
      return (valueA || 0) - (valueB || 0);
    },
  };
}

/**
 * Creates a text column with basic sorting
 */
export function createTextColumn<T>(
  accessorKey: keyof T,
  header: string,
  transform?: (value: unknown) => string
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string);
      return transform ? transform(value) : value;
    },
    enableSorting: true,
  };
}

/**
 * Example usage for Employee columns using the helper functions
 */
/*
import { Employee } from "@/models";

export const employeeColumns: ColumnDef<Employee>[] = [
  createTextColumn<Employee>("first_name", "First Name"),
  createTextColumn<Employee>("last_name", "Last Name"),
  createDateColumn<Employee>("employment_date", "Employment Date"),
  createCurrencyColumn<Employee>("daily_rate", "Daily Rate"),
];
*/
