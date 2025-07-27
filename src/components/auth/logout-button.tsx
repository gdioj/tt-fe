'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/app/login/actions"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  showIcon?: boolean
  children?: React.ReactNode
}

export function LogoutButton({ 
  variant = "outline", 
  size = "default", 
  showIcon = true,
  children = "Logout"
}: LogoutButtonProps) {
  return (
    <form action={logout}>
      <Button type="submit" variant={variant} size={size}>
        {showIcon && <LogOut className="w-4 h-4 mr-2" />}
        {children}
      </Button>
    </form>
  )
}
