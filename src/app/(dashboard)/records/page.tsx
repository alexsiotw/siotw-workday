"use client"

import * as React from "react"
import { 
  History, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User,
  Loader2,
  BookOpen
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
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

export default function RecordsPage() {
  const { user, loading: userLoading } = useUser()
  const [enrollments, setEnrollments] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchRecords() {
      if (!user) return
      setIsLoading(true)
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('student_id', user.id)
        .order('enrolled_at', { ascending: false })
      
      if (!error && data) {
        setEnrollments(data)
      }
      setIsLoading(false)
    }

    if (user) {
      fetchRecords()
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Academic Records</h1>
          <p className="text-muted-foreground">View your official enrollment history and academic status.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-[#005cb9]" />
                <CardTitle className="text-lg">Enrollment History</CardTitle>
              </div>
              <CardDescription>A complete log of your registrations.</CardDescription>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#005cb9]" />
                    </TableCell>
                  </TableRow>
                ) : enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{record.courses.title}</span>
                          <span className="text-xs text-[#005cb9] font-medium">{record.courses.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{record.courses.credits}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(record.enrolled_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase transition-colors ${
                          record.status === 'enrolled' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {record.status === 'enrolled' && <CheckCircle2 className="h-3 w-3" />}
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Term Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Credits</span>
                  <span className="font-bold">{enrollments.reduce((acc, e) => acc + (e.courses.credits || 0), 0)}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm text-slate-600">Cumulative GPA</span>
                  <span className="font-bold text-green-600">3.85</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-[#005cb9] text-white shadow-lg overflow-hidden relative">
              <CardHeader>
                <CardTitle className="text-base">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4 relative z-10">
                <p className="text-blue-50">Need an official transcript? Request one through the Registrar portal.</p>
                <div className="pt-2">
                  <span className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4" />
                    Transcript Services
                  </span>
                </div>
              </CardContent>
              <GraduationCap className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
