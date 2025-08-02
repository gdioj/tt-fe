'use client';

import { DataTable } from '@/components/data/data-table';
import { logger } from '@/lib/logger';
import { Employee } from '@/models';
import { useCallback, useState } from 'react';
import { AddEmployeeModal } from './add-employee-modal';
import { columns } from './columns';
import { EmployeeDetailModal } from './employee-detail-modal';

interface EmployeesTableProps {
  employees: Employee[];
}

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const [selectedRows, setSelectedRows] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (row: { original: Employee }) => {
    if (process.env.NODE_ENV === 'development') {
      logger.log('Employee clicked:', row.original);
    }
    setSelectedEmployee(row.original);
    setModalOpen(true);
  };

  const handleRowSelectionChange = useCallback((rows: Employee[]) => {
    setSelectedRows(rows);
    console.log('Selected rows:', rows);
  }, []);

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
        enableRowSelection={true}
        onRowSelectionChange={handleRowSelectionChange}
      />
      <EmployeeDetailModal
        employee={selectedEmployee}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
