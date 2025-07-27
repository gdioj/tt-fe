import { createClient } from "@/util/supabase/server";
import { Employee, EmployeeFormData } from "@/models";

interface EmployeeDetailField {
  id: string;
  field: string;
  value: string;
}

interface ExtendedEmployeeFormData extends EmployeeFormData {
  employee_details: EmployeeDetailField[];
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class EmployeeService {
  /**
   * Fetches all employees from the database
   * @returns Promise<Employee[]> - Array of employees or empty array if error
   */
  static async getAll(): Promise<Employee[]> {
    try {
      const supabase = await createClient();

      const { data: employees, error } = await supabase
        .from("employees")
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching employees:", error);
        return [];
      }

      return employees || [];
    } catch (error) {
      console.error("Unexpected error fetching employees:", error);
      return [];
    }
  }

  /**
   * Fetches a single employee by UID
   * @param uid - The employee's unique identifier
   * @returns Promise<Employee | null> - Employee object or null if not found
   */
  static async getById(uid: string): Promise<Employee | null> {
    try {
      const supabase = await createClient();

      const { data: employee, error } = await supabase
        .from("employees")
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .eq("uid", uid)
        .single();

      if (error) {
        console.error(`Error fetching employee ${uid}:`, error);
        return null;
      }

      return employee;
    } catch (error) {
      console.error(`Unexpected error fetching employee ${uid}:`, error);
      return null;
    }
  }

  /**
   * Creates a new employee with details
   * @param formData - Extended employee form data including details
   * @returns Promise<ServiceResponse<Employee>> - Response with created employee or error
   */
  static async createWithDetails(formData: ExtendedEmployeeFormData): Promise<ServiceResponse<Employee>> {
    try {
      const supabase = await createClient();

      // First, insert the employee
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .insert([
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            employment_date: formData.employment_date,
            daily_rate: formData.daily_rate,
            notes: formData.notes || null,
            tags: formData.tags || null,
          },
        ])
        .select()
        .single();

      if (employeeError) {
        console.error("Error adding employee:", employeeError);
        return { success: false, error: employeeError.message };
      }

      // Then, insert employee details if any exist
      if (formData.employee_details && formData.employee_details.length > 0) {
        const validDetails = formData.employee_details.filter(
          detail => detail.field.trim() !== "" && detail.value.trim() !== ""
        );

        if (validDetails.length > 0) {
          const detailsToInsert = validDetails.map(detail => ({
            employee_id: employeeData.uid,
            field: detail.field.trim(),
            value: detail.value.trim(),
          }));

          const { error: detailsError } = await supabase
            .from("employee_details")
            .insert(detailsToInsert);

          if (detailsError) {
            console.error("Error adding employee details:", detailsError);
            // Note: Employee was created successfully, but details failed
            // You might want to handle this differently based on your requirements
          }
        }
      }

      return { success: true, data: employeeData };
    } catch (error) {
      console.error("Unexpected error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  }

  /**
   * Creates a new employee (simple version)
   * @param employee - Employee data without uid (will be generated)
   * @returns Promise<Employee | null> - Created employee or null if error
   */
  static async create(employee: Omit<Employee, 'uid'>): Promise<Employee | null> {
    try {
      const supabase = await createClient();

      const { data: newEmployee, error } = await supabase
        .from("employees")
        .insert([employee])
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .single();

      if (error) {
        console.error("Error creating employee:", error);
        return null;
      }

      return newEmployee;
    } catch (error) {
      console.error("Unexpected error creating employee:", error);
      return null;
    }
  }

  /**
   * Updates an existing employee
   * @param uid - The employee's unique identifier
   * @param updates - Partial employee data to update
   * @returns Promise<Employee | null> - Updated employee or null if error
   */
  static async update(uid: string, updates: Partial<Omit<Employee, 'uid'>>): Promise<Employee | null> {
    try {
      const supabase = await createClient();

      const { data: updatedEmployee, error } = await supabase
        .from("employees")
        .update(updates)
        .eq("uid", uid)
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .single();

      if (error) {
        console.error(`Error updating employee ${uid}:`, error);
        return null;
      }

      return updatedEmployee;
    } catch (error) {
      console.error(`Unexpected error updating employee ${uid}:`, error);
      return null;
    }
  }

  /**
   * Deletes an employee
   * @param uid - The employee's unique identifier
   * @returns Promise<boolean> - True if successful, false if error
   */
  static async delete(uid: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("uid", uid);

      if (error) {
        console.error(`Error deleting employee ${uid}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Unexpected error deleting employee ${uid}:`, error);
      return false;
    }
  }

  /**
   * Searches employees by name (first or last name)
   * @param searchTerm - The search term
   * @returns Promise<Employee[]> - Array of matching employees
   */
  static async searchByName(searchTerm: string): Promise<Employee[]> {
    try {
      const supabase = await createClient();

      const { data: employees, error } = await supabase
        .from("employees")
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error searching employees:", error);
        return [];
      }

      return employees || [];
    } catch (error) {
      console.error("Unexpected error searching employees:", error);
      return [];
    }
  }

  /**
   * Filters employees by date range
   * @param startDate - Start date (YYYY-MM-DD format)
   * @param endDate - End date (YYYY-MM-DD format)
   * @returns Promise<Employee[]> - Array of employees within date range
   */
  static async getByDateRange(startDate: string, endDate: string): Promise<Employee[]> {
    try {
      const supabase = await createClient();

      const { data: employees, error } = await supabase
        .from("employees")
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .gte("employment_date", startDate)
        .lte("employment_date", endDate)
        .order("employment_date", { ascending: false });

      if (error) {
        console.error("Error fetching employees by date range:", error);
        return [];
      }

      return employees || [];
    } catch (error) {
      console.error("Unexpected error fetching employees by date range:", error);
      return [];
    }
  }

  /**
   * Filters employees by daily rate range
   * @param minRate - Minimum daily rate
   * @param maxRate - Maximum daily rate
   * @returns Promise<Employee[]> - Array of employees within rate range
   */
  static async getByRateRange(minRate: number, maxRate: number): Promise<Employee[]> {
    try {
      const supabase = await createClient();

      const { data: employees, error } = await supabase
        .from("employees")
        .select("uid, first_name, last_name, employment_date, daily_rate")
        .gte("daily_rate", minRate)
        .lte("daily_rate", maxRate)
        .order("daily_rate", { ascending: false });

      if (error) {
        console.error("Error fetching employees by rate range:", error);
        return [];
      }

      return employees || [];
    } catch (error) {
      console.error("Unexpected error fetching employees by rate range:", error);
      return [];
    }
  }
}
