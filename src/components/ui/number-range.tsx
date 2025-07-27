"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NumberRangeProps {
  min?: number
  max?: number
  onRangeChange?: (min?: number, max?: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function NumberRange({
  min,
  max,
  onRangeChange,
  placeholder: _placeholder = "Range",
  disabled,
  className
}: NumberRangeProps) {
  const [minValue, setMinValue] = React.useState<string>(min?.toString() || "")
  const [maxValue, setMaxValue] = React.useState<string>(max?.toString() || "")

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMinValue(value)
    const numValue = value === "" ? undefined : parseFloat(value)
    const maxNum = maxValue === "" ? undefined : parseFloat(maxValue)
    onRangeChange?.(numValue, maxNum)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMaxValue(value)
    const minNum = minValue === "" ? undefined : parseFloat(minValue)
    const numValue = value === "" ? undefined : parseFloat(value)
    onRangeChange?.(minNum, numValue)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        type="number"
        placeholder="Min"
        value={minValue}
        onChange={handleMinChange}
        disabled={disabled}
        className="w-24"
        step="0.01"
      />
      <span className="text-muted-foreground text-sm">to</span>
      <Input
        type="number"
        placeholder="Max"
        value={maxValue}
        onChange={handleMaxChange}
        disabled={disabled}
        className="w-24"
        step="0.01"
      />
    </div>
  )
}
