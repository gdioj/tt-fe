"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@/models";
import { formatCurrency, formatDate } from "@/lib/formatters";
// Alternative approach using column helpers:
// import { createTextColumn, createDateColumn, createCurrencyColumn } from "@/lib/column-helpers";

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => row.getValue("first_name"),
    enableSorting: true,
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: ({ row }) => row.getValue("last_name"),
    enableSorting: true,
  },
  {
    accessorKey: "employment_date",
    header: "Employment Date",
    cell: ({ row }) => formatDate(row.getValue("employment_date")),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.getValue("employment_date"));
      const dateB = new Date(rowB.getValue("employment_date"));
      return dateA.getTime() - dateB.getTime();
    },
  },
  {
    accessorKey: "daily_rate",
    header: "Daily Rate",
    cell: ({ row }) => formatCurrency(row.getValue("daily_rate")),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const rateA = rowA.getValue("daily_rate") as number;
      const rateB = rowB.getValue("daily_rate") as number;
      return rateA - rateB;
    },
  },
];

/* 
// Alternative using helper functions (cleaner approach):
export const columns: ColumnDef<Employee>[] = [
  createTextColumn<Employee>("first_name", "First Name"),
  createTextColumn<Employee>("last_name", "Last Name"),
  createDateColumn<Employee>("employment_date", "Employment Date"),
  createCurrencyColumn<Employee>("daily_rate", "Daily Rate"),
];
*/
