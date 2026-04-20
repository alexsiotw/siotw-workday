"use client"

import * as React from "react"
import { 
  Users, 
  BookOpen, 
  CheckCircle2,
  TrendingUp,
  Loader2,
  PlusCircle,
  ArrowRight
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/layout/AppShell"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

export default function AdminOverviewPage() {
  const { user, loading: userLoading } = useUser()
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  })
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      const [studentsRes, coursesRes, enrollmentsRes] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        totalStudents: studentsRes.count || 0,
        totalCourses: coursesRes.count || 0,
        totalEnrollments: enrollmentsRes.count || 0,
      })
      setIsLoading(false)
    }

    if (user && user.role === 'admin') {
      fetchStats()
    }
  }, [user])

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#005cb9]" />
      </div>
    )
  }

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Administrator Console</h1>
          <p className="text-muted-foreground">High-level system overview and quick actions.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-[#005cb9]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Currently in catalog</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Enrollments</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">Total student signups</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Quick Actions */}
          <Card className="border-none shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg">Quick Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/courses" className="block">
                <Button className="w-full justify-between bg-[#005cb9] hover:bg-[#004a96]" size="lg">
                  <div className="flex items-center">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Manage Courses
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin/students" className="block">
                <Button variant="outline" className="w-full justify-between" size="lg">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-[#005cb9]" />
                    Review Student List
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* System Health / Info */}
          <Card className="border-none shadow-sm h-full bg-slate-50 border border-slate-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                System Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-muted-foreground">Average Class Size</span>
                  <span className="font-semibold">{stats.totalCourses > 0 ? (stats.totalEnrollments / stats.totalCourses).toFixed(1) : 0} Students</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <span className="text-muted-foreground">System Status</span>
                  <span className="flex items-center gap-1.5 font-semibold text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-600" />
                    Operational
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
