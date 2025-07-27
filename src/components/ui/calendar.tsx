"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
}

function Calendar({
  className,
  mode: _mode = "single",
  selected,
  onSelect,
  disabled,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(selected || new Date())

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => setMonth(subMonths(month, 1))
  const nextMonth = () => setMonth(addMonths(month, 1))

  // Get day names for header
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Get starting day of the month (0 = Sunday, 1 = Monday, etc.)
  const startingDayOfWeek = monthStart.getDay()

  // Create empty cells for days from previous month
  const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => (
    <div key={`empty-${i}`} className="h-9 w-9" />
  ))

  return (
    <div className={cn("p-3", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={previousMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {format(month, "MMMM yyyy")}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="h-9 w-9 text-center text-xs font-medium text-muted-foreground flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {emptyCells}
        {days.map((day) => {
          const isSelected = selected && isSameDay(day, selected)
          const isDisabled = disabled?.(day)
          const isCurrentMonth = isSameMonth(day, month)

          return (
            <Button
              key={day.toString()}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-9 w-9 p-0 font-normal",
                !isCurrentMonth && "text-muted-foreground",
                isSelected && "bg-primary text-primary-foreground",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect?.(day)}
            >
              {format(day, "d")}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
