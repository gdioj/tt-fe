'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { NumberRange } from '@/components/ui/number-range';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { logger } from '@/lib/logger';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  Search,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

type ColumnType = 'text' | 'date' | 'number';

interface ColumnFilter {
  id: string;
  value: string;
  label: string;
  type: ColumnType;
}

interface FilterableColumn {
  id: string;
  header: string;
  type: ColumnType;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  onRowClick?: (row: Row<TData>) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = 'Search all columns...',
  emptyMessage = 'No results.',
  onRowClick = undefined,
  enableRowSelection = false,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile();
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [appliedFilters, setAppliedFilters] = useState<ColumnFilter[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [numberRange, setNumberRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  // Helper function to detect column type
  const getColumnType = (columnId: string): ColumnType => {
    if (columnId.includes('date') || columnId.includes('Date')) {
      return 'date';
    }
    if (
      columnId.includes('rate') ||
      columnId.includes('amount') ||
      columnId.includes('price') ||
      columnId.includes('salary')
    ) {
      return 'number';
    }
    return 'text';
  };

  // Get filterable columns (exclude action columns and selection column)
  const filterableColumns: FilterableColumn[] = columns
    .filter((column) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const columnDef = column as any;
      return (
        (columnDef.accessorKey || column.id) &&
        typeof column.header === 'string' &&
        column.id !== 'select'
      );
    })
    .map((column) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const columnDef = column as any;
      const id = columnDef.accessorKey || column.id;
      return {
        id: id || '',
        header: column.header as string,
        type: getColumnType(id || ''),
      };
    });

  const getSelectedColumnType = (): ColumnType => {
    const column = filterableColumns.find((col) => col.id === selectedColumn);
    return column?.type || 'text';
  };

  const handleColumnSelect = (columnId: string) => {
    setSelectedColumn(columnId);
    // Reset all input states when column changes
    setFilterValue('');
    setSelectedDate(undefined);
    setNumberRange({});
  };

  const addFilter = () => {
    if (!selectedColumn) {
      return;
    }

    const column = filterableColumns.find((col) => col.id === selectedColumn);
    const columnLabel = column?.header || selectedColumn;
    const columnType = column?.type || 'text';

    let filterValueToAdd = '';
    let isValidFilter = false;

    // Get the appropriate filter value based on column type
    switch (columnType) {
      case 'date':
        if (selectedDate) {
          filterValueToAdd = format(selectedDate, 'yyyy-MM-dd');
          isValidFilter = true;
        }
        break;
      case 'number':
        if (numberRange.min !== undefined || numberRange.max !== undefined) {
          const rangeStr = `${numberRange.min || ''}:${numberRange.max || ''}`;
          filterValueToAdd = rangeStr;
          isValidFilter = true;
        }
        break;
      case 'text':
      default:
        if (filterValue.trim()) {
          filterValueToAdd = filterValue.trim();
          isValidFilter = true;
        }
        break;
    }

    if (!isValidFilter) {
      return;
    }

    const newFilter: ColumnFilter = {
      id: selectedColumn,
      value: filterValueToAdd,
      label: columnLabel,
      type: columnType,
    };

    // Check if filter already exists
    const existingFilterIndex = appliedFilters.findIndex(
      (filter) =>
        filter.id === selectedColumn && filter.value === filterValueToAdd
    );

    if (existingFilterIndex === -1) {
      const updatedFilters = [...appliedFilters, newFilter];
      setAppliedFilters(updatedFilters);

      // Update react-table column filters
      const updatedColumnFilters = [...columnFilters];
      const existingColumnFilterIndex = updatedColumnFilters.findIndex(
        (f) => f.id === selectedColumn
      );

      const filterObject = {
        id: selectedColumn,
        value: filterValueToAdd,
      };

      if (existingColumnFilterIndex >= 0) {
        // For multiple filters on same column, we'll handle it differently
        // For now, replace the existing filter
        updatedColumnFilters[existingColumnFilterIndex] = filterObject;
      } else {
        updatedColumnFilters.push(filterObject);
      }

      setColumnFilters(updatedColumnFilters);
    }

    // Reset input values
    setFilterValue('');
    setSelectedDate(undefined);
    setNumberRange({});
    setSelectedColumn('');
  };

  const removeFilter = (filterToRemove: ColumnFilter) => {
    const updatedFilters = appliedFilters.filter(
      (filter) =>
        !(
          filter.id === filterToRemove.id &&
          filter.value === filterToRemove.value
        )
    );
    setAppliedFilters(updatedFilters);

    // Update react-table column filters
    const updatedColumnFilters = [...columnFilters];
    const columnFilterIndex = updatedColumnFilters.findIndex(
      (f) => f.id === filterToRemove.id
    );

    if (columnFilterIndex >= 0) {
      // For now, since we're replacing filters per column, just remove it entirely
      // In a more advanced implementation, we could handle multiple filters per column
      updatedColumnFilters.splice(columnFilterIndex, 1);
    }

    setColumnFilters(updatedColumnFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addFilter();
    }
  };

  const renderFilterInput = () => {
    const columnType = getSelectedColumnType();

    switch (columnType) {
      case 'date':
        return (
          <DatePicker
            date={selectedDate}
            onSelect={setSelectedDate}
            placeholder="Select date..."
            disabled={!selectedColumn}
            className={isMobile ? 'w-40' : 'w-48'}
          />
        );
      case 'number':
        return (
          <NumberRange
            min={numberRange.min}
            max={numberRange.max}
            onRangeChange={(min?: number, max?: number) =>
              setNumberRange({ min, max })
            }
            disabled={!selectedColumn}
            className={isMobile ? 'w-44' : 'w-56'}
          />
        );
      case 'text':
      default:
        return (
          <Input
            placeholder="Filter value..."
            value={filterValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilterValue(e.target.value)
            }
            onKeyPress={handleKeyPress}
            className={isMobile ? 'w-40' : 'w-48'}
            disabled={!selectedColumn}
          />
        );
    }
  };

  const isFilterValid = () => {
    if (!selectedColumn) {
      return false;
    }

    const columnType = getSelectedColumnType();
    switch (columnType) {
      case 'date':
        return selectedDate !== undefined;
      case 'number':
        return numberRange.min !== undefined || numberRange.max !== undefined;
      case 'text':
      default:
        return filterValue.trim() !== '';
    }
  };

  const formatFilterValue = (filter: ColumnFilter): string => {
    switch (filter.type) {
      case 'date':
        return format(new Date(filter.value), 'MMM dd, yyyy');
      case 'number':
        const [min, max] = filter.value.split(':');
        if (min && max) {
          return `${min} - ${max}`;
        }
        if (min) {
          return `≥ ${min}`;
        }
        if (max) {
          return `≤ ${max}`;
        }
        return filter.value;
      case 'text':
      default:
        return filter.value;
    }
  };

  const handleRowClick = (row: Row<TData>, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox
    if ((event.target as HTMLElement).closest('[data-checkbox]')) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
    }
  };

  const renderMobileCard = (row: Row<TData>) => {
    // Get all visible cells from the row (excluding selection column)
    const visibleCells = row
      .getVisibleCells()
      .filter((cell) => cell.column.id !== 'select');

    // Filter out action columns (columns without accessorKey and with non-string headers)
    const dataCells = visibleCells.filter((cell) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const columnDef = cell.column.columnDef as any;
      return (
        (columnDef.accessorKey || cell.column.id) &&
        typeof cell.column.columnDef.header === 'string'
      );
    });

    return (
      <Card
        key={row.id}
        className={`mb-3 cursor-pointer hover:bg-muted/70 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out border-2 hover:border-primary/20 ${
          enableRowSelection && row.getIsSelected()
            ? 'ring-2 ring-primary border-primary'
            : ''
        }`}
        onClick={(event) => handleRowClick(row, event)}
      >
        <CardContent className="p-4">
          {enableRowSelection && (
            <div
              className="flex items-center mb-3"
              data-checkbox
              onClick={() => row.toggleSelected(!row.getIsSelected())}
            >
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
              <span className="ml-2 text-sm text-muted-foreground">
                {row.getIsSelected() ? 'Selected' : 'Select'}
              </span>
            </div>
          )}
          <div className="space-y-2">
            {dataCells.map((cell, index) => {
              const header = cell.column.columnDef.header as string;

              return (
                <div
                  key={cell.id}
                  className={
                    index === 0 ? 'font-semibold text-base' : 'text-sm'
                  }
                >
                  {index === 0 ? (
                    // First column as the main title
                    <div className="text-foreground">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ) : (
                    // Other columns with labels
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">
                        {header}:
                      </span>
                      <span className="text-foreground">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Create columns with selection column if enabled
  const tableColumns = React.useMemo(() => {
    if (!enableRowSelection) {
      return columns;
    }

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div data-checkbox>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns.map((column) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const columnDef = column as any;
      const columnId = columnDef.accessorKey || column.id;

      // Skip filter function assignment for selection column
      if (columnId === 'select') {
        return column;
      }

      const columnType = getColumnType(columnId);

      // Set the appropriate filter function based on column type
      const updatedColumn = { ...column };

      if (columnType === 'date') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedColumn as any).filterFn = 'dateFilter';
      } else if (columnType === 'number') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedColumn as any).filterFn = 'numberRangeFilter';
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedColumn as any).filterFn = 'textFilter';
      }

      return updatedColumn;
    }),
    state: {
      globalFilter,
      sorting,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dateFilter: (row: any, columnId: string, filterValue: string) => {
        // Get the raw unformatted value from the row's original data
        const cellValue = row.original[
          columnId as keyof typeof row.original
        ] as string;

        if (!cellValue) {
          return false;
        }

        const cellDate = new Date(cellValue);
        const filterDate = new Date(filterValue);

        // Compare dates by converting to date strings (ignoring time)
        return cellDate.toDateString() === filterDate.toDateString();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      numberRangeFilter: (row: any, columnId: string, filterValue: string) => {
        // Get the raw unformatted value from the row's original data
        const cellValue = row.original[
          columnId as keyof typeof row.original
        ] as number;
        const [min, max] = filterValue
          .split(':')
          .map((v: string) => (v === '' ? undefined : parseFloat(v)));

        // Handle case where cellValue might be null/undefined
        if (cellValue === null || cellValue === undefined || isNaN(cellValue)) {
          return false;
        }

        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          logger.log(
            `Filtering ${columnId}: ${cellValue} against range [${min}, ${max}]`
          );
        }

        if (min !== undefined && cellValue < min) {
          return false;
        }
        if (max !== undefined && cellValue > max) {
          return false;
        }
        return true;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      textFilter: (row: any, columnId: string, filterValue: string) => {
        // For text columns, we can use the formatted display value since that's what users see
        const cellValue = row.getValue(columnId) as string;
        return (
          cellValue
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ?? false
        );
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalFilterFn: (row: any, columnId: string, filterValue: string) => {
      const cellValue = row.getValue(columnId) as string;
      return (
        cellValue
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ?? false
      );
    },
  });

  // Call onRowSelectionChange when selection changes
  React.useEffect(() => {
    if (enableRowSelection && onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, enableRowSelection, onRowSelectionChange]);

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Global Search */}
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setGlobalFilter(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {enableRowSelection && selectedCount > 0 && (
            <span className="mr-4 font-medium text-primary">
              {selectedCount} selected &nbsp;
            </span>
          )}
          {table.getFilteredRowModel().rows.length} of {data.length} row(s)
        </div>
      </div>

      {/* Column-specific Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {selectedColumn
                  ? `${filterableColumns.find((col) => col.id === selectedColumn)?.header} (${getSelectedColumnType()})`
                  : 'Select Column'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {filterableColumns.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={() => handleColumnSelect(column.id)}
                >
                  {column.header}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-shrink-0">{renderFilterInput()}</div>

          <Button
            onClick={addFilter}
            size="sm"
            disabled={!isFilterValid()}
            className="flex-shrink-0"
          >
            <Search className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
      </div>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {appliedFilters.map((filter, index) => (
            <Badge
              key={`${filter.id}-${filter.value}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => removeFilter(filter)}
            >
              <span className="text-xs font-medium">{filter.label}:</span>
              <span className="text-xs">{formatFilterValue(filter)}</span>
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAppliedFilters([]);
              setColumnFilters([]);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Selection Actions */}
      {enableRowSelection && selectedCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <span className="text-sm font-medium">
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.toggleAllRowsSelected(false)}
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Mobile View - Cards */}
      {isMobile ? (
        <div className="space-y-3">
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => renderMobileCard(row))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">{emptyMessage}</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Desktop View - Table */
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'flex items-center space-x-2 cursor-pointer select-none hover:text-accent-foreground hover:bg-muted/30 rounded px-2 py-1 transition-all duration-200'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                            >
                              {header.column.getIsSorted() === 'desc' ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : header.column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`hover:bg-muted/70 hover:shadow-sm transition-all duration-200 ease-in-out group ${
                      onRowClick !== undefined ? 'cursor-pointer' : ''
                    } ${enableRowSelection && row.getIsSelected() ? 'bg-muted/50' : ''}`}
                    onClick={(event) => handleRowClick(row, event)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="font-medium group-hover:text-foreground/90"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
