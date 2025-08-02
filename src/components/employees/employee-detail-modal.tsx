import { DataTable } from '@/components/data/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/lib/logger';
import { Employee, EmployeeDetail, EmployeeLog } from '@/models';
import { createClient } from '@/util/supabase/client';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, FileText, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmployeeFullData {
  employee: Employee;
  details: EmployeeDetail[];
  logs: EmployeeLog[];
}

const employeeLogsColumns: ColumnDef<EmployeeLog>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'content',
    header: 'Content',
    cell: ({ row }) => {
      const content = row.getValue('content') as string;
      if (!content) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="max-w-md truncate" title={content}>
          {content}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return format(new Date(date), "MMM dd, yyyy 'at' HH:mm");
    },
  },
];

export function EmployeeDetailModal({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeFullData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formEmployee, setFormEmployee] = useState<Employee | null>(null);
  const [formDetails, setFormDetails] = useState<EmployeeDetail[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // State for creating a new log
  const [showLogForm, setShowLogForm] = useState(false);
  const [logTitle, setLogTitle] = useState('');
  const [logContent, setLogContent] = useState('');
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logError, setLogError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!employee || !open) {
      setEmployeeData(null);
      setError(null);
      setEditMode(false);
      setFormEmployee(null);
      setFormDetails([]);
      return;
    }

    const fetchEmployeeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const [detailsResponse, logsResponse] = await Promise.all([
          supabase
            .from('employee_details')
            .select('uid, employee_id, field, value, created_at, created_by')
            .eq('employee_id', employee.uid)
            .order('created_at', { ascending: false }),
          supabase
            .from('employee_logs')
            .select('uid, employee_id, title, content, created_at, created_by')
            .eq('employee_id', employee.uid)
            .order('created_at', { ascending: false }),
        ]);
        if (detailsResponse.error) {
          logger.error(
            'Error fetching employee details:',
            detailsResponse.error
          );
          throw new Error('Failed to fetch employee details');
        }
        if (logsResponse.error) {
          logger.error('Error fetching employee logs:', logsResponse.error);
          throw new Error('Failed to fetch employee logs');
        }
        setEmployeeData({
          employee,
          details: detailsResponse.data || [],
          logs: logsResponse.data || [],
        });
        setFormEmployee(employee);
        setFormDetails(detailsResponse.data || []);
      } catch (err) {
        logger.error('Error fetching employee data:', err);
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeData();
  }, [employee, open]);

  const formatEmploymentDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  if (!employee) return null;
  // Editable form fields for employee
  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formEmployee) return;
    setFormEmployee({ ...formEmployee, [e.target.name]: e.target.value });
  };
  // Editable form fields for details
  const handleDetailChange = (idx: number, field: string, value: string) => {
    setFormDetails((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, field, value } : d))
    );
  };
  // Add new detail
  const handleAddDetail = () => {
    if (!employee) return;
    setFormDetails((prev) => [
      ...prev,
      {
        uid: '',
        employee_id: employee.uid,
        field: '',
        value: '',
        created_at: new Date().toISOString(),
        created_by: '',
      },
    ]);
  };
  // Remove detail
  const handleRemoveDetail = (idx: number) => {
    setFormDetails((prev) => prev.filter((_, i) => i !== idx));
  };
  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmployee) return;
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      // Update employee
      const { error: empError } = await supabase
        .from('employees')
        .update({
          first_name: formEmployee.first_name,
          last_name: formEmployee.last_name,
          employment_date: formEmployee.employment_date,
          daily_rate: Number(formEmployee.daily_rate),
        })
        .eq('uid', formEmployee.uid);
      if (empError) throw new Error(empError.message);
      // Update details
      for (const detail of formDetails) {
        if (detail.uid) {
          // Update existing
          const { error: detError } = await supabase
            .from('employee_details')
            .update({ field: detail.field, value: detail.value })
            .eq('uid', detail.uid);
          if (detError) throw new Error(detError.message);
        } else if (detail.field && detail.value) {
          // Insert new
          const { error: detError } = await supabase
            .from('employee_details')
            .insert({
              employee_id: employee.uid,
              field: detail.field,
              value: detail.value,
            });
          if (detError) throw new Error(detError.message);
        }
      }
      setEditMode(false);
      // Refetch data
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };
  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !logTitle.trim()) {
      setLogError('Title is required');
      return;
    }
    setLogSubmitting(true);
    setLogError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('employee_logs').insert({
        employee_id: employee.uid,
        title: logTitle.trim(),
        content: logContent.trim(),
      });
      if (error) throw new Error(error.message);
      setShowLogForm(false);
      setLogTitle('');
      setLogContent('');
      // Refetch data
      window.location.reload();
    } catch (err) {
      setLogError(err instanceof Error ? err.message : 'Failed to create log');
    } finally {
      setLogSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] md:max-w-[80vw] w-full max-h-[95vh] min-h-[60vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {employee.first_name} {employee.last_name}
          </DialogTitle>
          <DialogDescription>
            View and edit employee details, information, and activity logs
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Info & Details</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            {/* Employee Info & Details Section */}
            {loading && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
                <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-32" />
                </div>
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-destructive text-sm">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            )}
            {employeeData && !loading && !editMode && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Employment Date
                      </span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatEmploymentDate(
                        employeeData.employee.employment_date
                      )}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Daily Rate</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatCurrency(employeeData.employee.daily_rate)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="default" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                </div>
                {/* ...existing details display... */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4" />
                    <h3 className="text-lg font-semibold">
                      Additional Details
                    </h3>
                    <Badge variant="outline">
                      {employeeData.details.length} detail
                      {employeeData.details.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {employeeData.details.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {employeeData.details.map((detail) => (
                        <div
                          key={detail.uid}
                          className="bg-muted/30 rounded-lg p-3 border"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-muted-foreground">
                                {detail.field}
                              </p>
                              <p className="text-sm mt-1">
                                {detail.value || (
                                  <span className="text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(detail.created_at), 'MMM dd')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-8 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No additional details found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {editMode && formEmployee && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <label className="block text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      type="text"
                      name="first_name"
                      value={formEmployee.first_name}
                      onChange={handleEmployeeChange}
                      required
                    />
                    <label className="block text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      name="last_name"
                      value={formEmployee.last_name}
                      onChange={handleEmployeeChange}
                      required
                    />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <label className="block text-sm font-medium">
                      Employment Date
                    </label>
                    <Input
                      type="date"
                      name="employment_date"
                      value={formEmployee.employment_date.slice(0, 10)}
                      onChange={handleEmployeeChange}
                      required
                    />
                    <label className="block text-sm font-medium">
                      Daily Rate
                    </label>
                    <Input
                      type="number"
                      name="daily_rate"
                      value={formEmployee.daily_rate}
                      onChange={handleEmployeeChange}
                      required
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4" />
                    <h3 className="text-lg font-semibold">
                      Additional Details
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddDetail}
                    >
                      Add Detail
                    </Button>
                  </div>
                  {formDetails.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      {formDetails.map((detail, idx) => (
                        <div
                          key={idx}
                          className="bg-muted/30 rounded-lg p-3 border space-y-2"
                        >
                          <Input
                            type="text"
                            placeholder="Field"
                            value={detail.field || ''}
                            onChange={(e) =>
                              handleDetailChange(
                                idx,
                                e.target.value,
                                detail.value || ''
                              )
                            }
                            required
                            className="mb-1"
                          />
                          <Input
                            type="text"
                            placeholder="Value"
                            value={detail.value || ''}
                            onChange={(e) =>
                              handleDetailChange(
                                idx,
                                detail.field,
                                e.target.value
                              )
                            }
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDetail(idx)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-8 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No details. Add one above.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
          <TabsContent value="logs">
            {/* Employee Logs Section */}
            {employeeData && !loading && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4" />
                  <h3 className="text-lg font-semibold">Activity Logs</h3>
                  <Badge variant="outline">
                    {employeeData.logs.length} log
                    {employeeData.logs.length !== 1 ? 's' : ''}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogForm((v) => !v)}
                  >
                    {showLogForm ? 'Cancel' : 'Create Log'}
                  </Button>
                </div>
                {showLogForm && (
                  <form
                    onSubmit={handleCreateLog}
                    className="bg-muted/30 rounded-lg p-4 mb-4 space-y-3"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Title <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="text"
                        value={logTitle}
                        onChange={(e) => setLogTitle(e.target.value)}
                        required
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Content
                      </label>
                      <Textarea
                        value={logContent}
                        onChange={(e) => setLogContent(e.target.value)}
                        maxLength={1000}
                        className="min-h-[80px]"
                      />
                    </div>
                    {logError && (
                      <p className="text-destructive text-sm">{logError}</p>
                    )}
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowLogForm(false)}
                        disabled={logSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        disabled={logSubmitting}
                      >
                        {logSubmitting ? 'Saving...' : 'Save Log'}
                      </Button>
                    </div>
                  </form>
                )}
                {employeeData.logs.length > 0 ? (
                  <DataTable
                    columns={employeeLogsColumns}
                    data={employeeData.logs}
                    searchPlaceholder="Search logs..."
                    emptyMessage="No logs found"
                  />
                ) : (
                  <div className="bg-muted/30 rounded-lg p-8 text-center">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      No activity logs found
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="other">
            {/* Blank Section for future use */}
            <div className="p-8 text-center text-muted-foreground h-full">
              (Reserved for future features)
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
