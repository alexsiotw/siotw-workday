"use client"

import { Search, Bell, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 transition-[width,height] ease-linear">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for courses, records, or help..."
            className="pl-8 bg-[#f5f7f9] border-none shadow-none focus-visible:ring-1 focus-visible:ring-[#005cb9]"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
