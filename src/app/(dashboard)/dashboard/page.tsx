"use client"

import * as React from "react"
import { 
  ChevronDown, 
  ChevronRight, 
  Settings, 
  CalendarDays,
  Search,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Clock,
  Loader2,
  AlertCircle
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AppShell } from "@/components/layout/AppShell"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

export default function WorkdayDashboardPage() {
  const { user, loading: userLoading } = useUser()
  const [stats, setStats] = React.useState({
    actionsToDo: 0,
    holds: 0,
    actionsCompleted: 0,
  })
  const [holds, setHolds] = React.useState<any[]>([])
  const [appointments, setAppointments] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchData() {
      if (!user) return
      setIsLoading(true)
      
      const [holdsRes, appointmentsRes, enrollmentsRes] = await Promise.all([
        supabase.from('holds').select('*').eq('student_id', user.id),
        supabase.from('appointments').select('*').eq('student_id', user.id).order('start_time', { ascending: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('student_id', user.id).eq('status', 'enrolled')
      ])

      const finalHolds = holdsRes.data || []
      setHolds(finalHolds)
      setAppointments(appointmentsRes.data || [])
      
      // Real-time logic: If they have 0 enrollments, they have 1 action to do (Register)
      const enrollCount = enrollmentsRes.count || 0;
      
      setStats({
        actionsToDo: enrollCount === 0 ? 1 : 0,
        holds: finalHolds.length,
        actionsCompleted: enrollCount > 0 ? 1 : 0
      })
      setIsLoading(false)
    }

    if (user) {
      fetchData()
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
      <div className="space-y-4 max-w-[1400px] mx-auto pb-10">
        {/* Registration Requirements Header */}
        <Card className="border border-slate-200 shadow-sm rounded-none overflow-hidden">
          <CardHeader className="bg-white py-3 px-6 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-700">Registration Requirements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              <div className="py-8 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-[#005cb9]">{stats.actionsToDo}</span>
                <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Actions To Do</span>
              </div>
              <div className="py-8 flex flex-col items-center justify-center">
                <span className={`text-4xl font-light ${stats.holds > 0 ? 'text-red-500' : 'text-[#005cb9]'}`}>{stats.holds}</span>
                <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Holds</span>
              </div>
              <div className="py-8 flex flex-col items-center justify-center font-bold">
                <span className="text-4xl font-light text-[#005cb9]">{stats.actionsCompleted}</span>
                <span className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Actions Completed</span>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-sm font-semibold text-[#005cb9] cursor-pointer hover:bg-slate-100 transition-colors tracking-tight">
              <ChevronDown className="h-4 w-4" />
              Actions To Do ({stats.actionsToDo})
            </div>
          </CardContent>
        </Card>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left/Middle Column Group */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Real Actions To Do List */}
            {stats.actionsToDo > 0 && (
              <Card className="border border-slate-200 shadow-sm rounded-none">
                <div className="p-6">
                   <Link href="/courses" className="flex items-start gap-3 group">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#005cb9] group-hover:underline">Register for Courses - Spring 2026</p>
                        <p className="text-xs text-slate-500 mt-1">You have not yet registered for classes for the upcoming term.</p>
                      </div>
                   </Link>
                </div>
              </Card>
            )}

            {/* Empty State when no actions */}
            {stats.actionsToDo === 0 && (
              <Card className="border border-slate-200 shadow-sm rounded-none h-32 flex items-center justify-center">
                <p className="text-slate-400 text-sm italic tracking-tight">No actions required at this time.</p>
              </Card>
            )}

            {/* My Holds Widget */}
            <Card className="border border-slate-200 shadow-sm rounded-none">
              <CardHeader className="py-3 px-6 flex flex-row items-center justify-between border-b border-slate-100">
                <CardTitle className="text-base font-semibold text-slate-700">My Holds</CardTitle>
                <Settings className="h-4 w-4 text-slate-400 cursor-pointer" />
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
                ) : holds.length === 0 ? (
                  <div className="p-12 text-center text-sm text-slate-500 italic tracking-tight">No items available.</div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50 border-y">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs uppercase font-bold text-slate-500">Hold Details</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-slate-500">Hold Reason</TableHead>
                        <TableHead className="text-xs uppercase font-bold text-slate-500">Resolution Instructions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holds.map((hold) => (
                        <TableRow key={hold.id}>
                          <TableCell className="text-sm font-semibold text-[#005cb9]">{hold.hold_type}</TableCell>
                          <TableCell className="text-sm">{hold.hold_reason}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{hold.resolution_instructions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Registration Appointments Info */}
            <Card className="border border-slate-200 shadow-sm rounded-none">
              <CardHeader className="py-3 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-700">Upcoming Registration Appointments</CardTitle>
                <Settings className="h-4 w-4 text-slate-400 cursor-pointer" />
              </CardHeader>
              <CardContent className="p-6">
                {appointments.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm italic tracking-tight">No registration appointments scheduled.</div>
                ) : (
                  <div className="border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 p-3 font-semibold text-sm border-b">
                      Registration Summary
                    </div>
                    <Table>
                      <TableHeader className="bg-white">
                        <TableRow className="hover:bg-transparent border-b">
                          <TableHead className="text-[10px] uppercase font-bold text-slate-500">Appointment</TableHead>
                          <TableHead className="text-[10px] uppercase font-bold text-slate-500">Start Time</TableHead>
                          <TableHead className="text-[10px] uppercase font-bold text-slate-500">Time Zone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-[11px]">
                        {appointments.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="text-[#005cb9] font-medium leading-tight">{app.title}</TableCell>
                            <TableCell>{new Date(app.start_time).toLocaleString()}</TableCell>
                            <TableCell className="text-slate-500 leading-tight">{app.time_zone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Planning & Registration Card */}
            <Card className="border border-slate-200 shadow-sm rounded-none">
              <CardHeader className="py-3 bg-white px-6 flex flex-row items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Planning & Registration</CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t border-slate-100">
                <div className="divide-y divide-slate-100">
                  <Link href="/courses" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 group">
                    <span className="text-sm text-slate-600 font-medium group-hover:text-[#005cb9]">Find Course Sections</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                  <Link href="/my-courses" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 group">
                    <span className="text-sm text-slate-600 font-medium group-hover:text-[#005cb9]">View My Courses</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Academic Records Card */}
            <Card className="border border-slate-200 shadow-sm rounded-none">
              <CardHeader className="py-3 bg-white px-6 flex flex-row items-center gap-2">
                <ClipboardList className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Academic Records</CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t border-slate-100">
                <div className="divide-y divide-slate-100">
                  <Link href="/grades" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 group">
                    <span className="text-sm text-slate-600 font-medium group-hover:text-[#005cb9]">View My Grades</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                  <Link href="/records" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 group">
                    <span className="text-sm text-slate-600 font-medium group-hover:text-[#005cb9]">View My Academic Record</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                  <Link href="/progress" className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 group">
                    <span className="text-sm text-slate-600 font-medium group-hover:text-[#005cb9]">View My Academic Progress</span>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Academic Advising Placeholder */}
            <Card className="border border-slate-200 shadow-sm rounded-none">
              <CardHeader className="py-3 bg-white px-6 flex flex-row items-center gap-2">
                <GraduationCap className="h-4 w-4 text-slate-500" />
                <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Academic Advising</CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t border-slate-100">
                <div className="px-6 py-3 text-sm text-slate-400 italic">No advisement items.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
