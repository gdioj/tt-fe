export interface Employee {
  uid: string;
  first_name: string;
  last_name: string;
  employment_date: string;
  daily_rate: number;
}

// Additional employee-related types can be added here
export interface EmployeeLog {
  uid: string;
  employee_id: string;
  title: string;
  content?: string;
  created_at: string;
  created_by?: string;
}

export interface EmployeeDetail {
  uid: string;
  employee_id: string;
  field: string;
  value?: string;
  created_at: string;
  created_by?: string;
}

// Employee form data type for creating/updating employees
export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  employment_date: string;
  daily_rate: number;
  notes?: string;
  tags?: string[];
}
