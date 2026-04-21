"use client"

import * as React from "react"
import { 
  Trophy, 
  BookOpen, 
  CheckCircle2,
  Loader2,
  Calendar
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

export default function GradesPage() {
  const { user, loading: userLoading } = useUser()
  const [enrollments, setEnrollments] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchGrades() {
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
      fetchGrades()
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
          <h1 className="text-3xl font-bold text-slate-800">My Grades</h1>
          <p className="text-muted-foreground">Detailed breakdown of your academic performance by term.</p>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#005cb9]" />
              <CardTitle className="text-lg">Spring 2026 Grades</CardTitle>
            </div>
            <CardDescription>Final and interim grades for the current semester.</CardDescription>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead className="text-center">Credits</TableHead>
                <TableHead className="text-center">Interim Grade</TableHead>
                <TableHead className="text-right">Final Grade</TableHead>
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
                    No grades recorded for this term.
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{record.courses.title}</span>
                        <span className="text-xs text-muted-foreground">{record.courses.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{record.courses.credits}</TableCell>
                    <TableCell className="text-center text-muted-foreground">--</TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-slate-800">{record.grade || "--"}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  )
}
