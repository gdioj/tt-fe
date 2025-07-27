"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeFormData } from "@/models";
import { addEmployee } from "@/app/(dashboard)/employees/actions";

interface EmployeeDetailField {
  id: string;
  field: string;
  value: string;
}

interface ExtendedEmployeeFormData extends EmployeeFormData {
  employee_details: EmployeeDetailField[];
}

export function AddEmployeeModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailyRateDisplay, setDailyRateDisplay] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "details">("basic");
  const [formData, setFormData] = useState<ExtendedEmployeeFormData>({
    first_name: "",
    last_name: "",
    employment_date: new Date().toISOString().split("T")[0],
    daily_rate: 0,
    notes: "",
    tags: [],
    employee_details: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await addEmployee(formData);
      
      if (result.success) {
        // Reset form and close modal
        setFormData({
          first_name: "",
          last_name: "",
          employment_date: "",
          daily_rate: 0,
          notes: "",
          tags: [],
          employee_details: [],
        });
        setDailyRateDisplay("");
        setActiveTab("basic");
        setOpen(false);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (_error) {
      alert("Failed to add employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ExtendedEmployeeFormData, value: string | number | EmployeeDetailField[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addEmployeeDetailField = () => {
    const newField: EmployeeDetailField = {
      id: Date.now().toString(),
      field: "",
      value: "",
    };
    
    setFormData(prev => ({
      ...prev,
      employee_details: [...prev.employee_details, newField],
    }));
  };

  const removeEmployeeDetailField = (id: string) => {
    setFormData(prev => ({
      ...prev,
      employee_details: prev.employee_details.filter(detail => detail.id !== id),
    }));
  };

  const updateEmployeeDetailField = (id: string, field: 'field' | 'value', newValue: string) => {
    setFormData(prev => ({
      ...prev,
      employee_details: prev.employee_details.map(detail =>
        detail.id === id ? { ...detail, [field]: newValue } : detail
      ),
    }));
  };

  const formatDailyRateInput = (value: string, cursorPosition?: number): { formatted: string; newCursorPosition: number } => {
    // Remove all non-digit and non-decimal characters
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Handle empty or invalid input
    if (!cleanValue || cleanValue === '.') {
      return { formatted: '', newCursorPosition: 0 };
    }
    
    // Split by decimal point
    const parts = cleanValue.split('.');
    const integerPart = parts[0] || '';
    let decimalPart = parts[1] || '';
    
    // Limit decimal places to 2
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.substring(0, 2);
    }
    
    // Add thousands separators to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Combine parts
    let formatted = formattedInteger;
    if (parts.length > 1 || cleanValue.endsWith('.')) {
      formatted += '.' + decimalPart;
    }
    
    // Calculate new cursor position
    let newCursorPosition = cursorPosition || formatted.length;
    if (cursorPosition !== undefined) {
      // Count commas before cursor in original vs new string
      const originalCommasBefore = (value.substring(0, cursorPosition).match(/,/g) || []).length;
      const newCommasBefore = (formatted.substring(0, cursorPosition).match(/,/g) || []).length;
      newCursorPosition = cursorPosition + (newCommasBefore - originalCommasBefore);
    }
    
    return { formatted, newCursorPosition };
  };

  const parseDailyRateValue = (formattedValue: string): number => {
    // Remove commas and parse as float
    const numericValue = formattedValue.replace(/,/g, '');
    const parsed = parseFloat(numericValue);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleDailyRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    const { formatted, newCursorPosition } = formatDailyRateInput(inputValue, cursorPosition);
    const numericValue = parseDailyRateValue(formatted);
    
    setDailyRateDisplay(formatted);
    handleInputChange("daily_rate", numericValue);
    
    // Restore cursor position after state update
    setTimeout(() => {
      if (e.target) {
        e.target.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Enter the employee details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "basic"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
            {activeTab !== "basic" && (
              formData.first_name || formData.last_name || formData.employment_date || formData.daily_rate > 0
            ) && (
              <span className="ml-1 h-2 w-2 bg-blue-500 rounded-full inline-block"></span>
            )}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Additional Details
            {formData.employee_details.length > 0 && (
              <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                {formData.employee_details.length}
              </span>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {activeTab === "basic" && (
              <div className="space-y-4 pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium">
                      First Name *
                    </label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium">
                      Last Name *
                    </label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="employment_date" className="text-sm font-medium">
                    Employment Date *
                  </label>
                  <Input
                    id="employment_date"
                    type="date"
                    value={formData.employment_date}
                    onChange={(e) => handleInputChange("employment_date", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="daily_rate" className="text-sm font-medium">
                    Daily Rate (₱) *
                  </label>
                  <Input
                    id="daily_rate"
                    type="text"
                    value={dailyRateDisplay}
                    onChange={handleDailyRateChange}
                    placeholder="0.00"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Optional notes about the employee"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4 pr-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Additional Employee Details</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Add custom fields like phone number, address, emergency contact, etc.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEmployeeDetailField}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                </div>
                
                {formData.employee_details.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No additional details added yet.</p>
                    <p className="text-xs mt-1">Click &quot;Add Field&quot; to start adding custom information.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.employee_details.map((detail, index) => (
                      <div key={detail.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-600">Field #{index + 1}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEmployeeDetailField(detail.id)}
                            disabled={isSubmitting}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                              Field Name
                            </label>
                            <Input
                              value={detail.field}
                              onChange={(e) => updateEmployeeDetailField(detail.id, 'field', e.target.value)}
                              placeholder="e.g. Phone Number, Address, Emergency Contact"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-700 mb-1 block">
                              Value
                            </label>
                            <Input
                              value={detail.value}
                              onChange={(e) => updateEmployeeDetailField(detail.id, 'value', e.target.value)}
                              placeholder="Enter the value for this field"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-2">
              {activeTab === "details" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("basic")}
                  disabled={isSubmitting}
                >
                  ← Back
                </Button>
              )}
              {activeTab === "basic" && formData.employee_details.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("details")}
                  disabled={isSubmitting}
                >
                  Add Details →
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Employee"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
