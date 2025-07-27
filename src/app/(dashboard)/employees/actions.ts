"use server";

import { EmployeeFormData } from "@/models";
import { revalidatePath } from "next/cache";
import { EmployeeService } from "@/services";
import { logger } from "@/lib/logger";

interface EmployeeDetailField {
  id: string;
  field: string;
  value: string;
}

interface ExtendedEmployeeFormData extends EmployeeFormData {
  employee_details: EmployeeDetailField[];
}

export async function addEmployee(formData: ExtendedEmployeeFormData) {
  try {
    const result = await EmployeeService.createWithDetails(formData);

    if (result.success) {
      // Revalidate the employees page to show the new employee
      revalidatePath("/dashboard/employees");
    }

    return result;
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      logger.error("Unexpected error in addEmployee action:", error);
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}
