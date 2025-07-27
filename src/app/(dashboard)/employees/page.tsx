import { Employee } from "@/models";
import { EmployeesTable } from "@/components/employees/employees-table";
import DashboardLayout from "../dashboard/dashboard.layout";
import { EmployeeService } from "@/services";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

async function getEmployees(): Promise<Employee[]> {
    return await EmployeeService.getAll();
}

export default async function EmployeesPage() {
    const employees = await getEmployees();

    return (
        <DashboardLayout>
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                    <p className="text-muted-foreground">
                        Manage and view all employees in your organization.
                    </p>
                </div>

                <EmployeesTable employees={employees} />
            </div>
        </DashboardLayout>
    );
}