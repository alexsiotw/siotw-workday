"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"

interface AppShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: 'student' | 'admin';
    avatarUrl?: string;
  } | null;
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={user} />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-[#f0f2f5] p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
