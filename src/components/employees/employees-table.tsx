"use client";

import { DataTable } from "@/components/data/data-table";
import { columns } from "./columns";
import { Employee } from "@/models";
import { AddEmployeeModal } from "./add-employee-modal";

interface EmployeesTableProps {
  employees: Employee[];
}

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const handleRowClick = (row: any) => {
    console.log('Employee clicked:', row.original);
    // Future implementation: navigate to employee detail page or open edit modal
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <AddEmployeeModal />
      </div>
      <DataTable 
        columns={columns} 
        data={employees} 
        onRowClick={handleRowClick}
      />
    </div>
  );
}
