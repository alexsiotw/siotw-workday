"use client"

import * as React from "react"
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  GraduationCap,
  PlusCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Menu items based on role.
const studentItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Course Catalog",
    url: "/courses",
    icon: Search,
  },
  {
    title: "My Records",
    url: "/records",
    icon: BookOpen,
  },
]

const adminItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Courses",
    url: "/admin/courses",
    icon: PlusCircle,
  },
  {
    title: "Students",
    url: "/admin/students",
    icon: User,
  },
]

interface AppSidebarProps {
  user: {
    name: string;
    email: string;
    role: 'student' | 'admin';
    avatarUrl?: string;
  } | null;
}

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()
  const items = user?.role === 'admin' ? adminItems : studentItems;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success("Logged out successfully")
      router.push("/login")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error logging out")
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2 font-semibold text-[#005cb9]">
          <GraduationCap className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">SIOTW Workday</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    }
                    tooltip={item.title}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="px-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground capitalize">{user.role}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
