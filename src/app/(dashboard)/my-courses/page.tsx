"use client"

import * as React from "react"
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  User,
  Loader2,
  CalendarDays,
  Search
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/layout/AppShell"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

export default function MyCoursesPage() {
  const { user, loading: userLoading } = useUser()
  const [enrolledCourses, setEnrolledCourses] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchEnrollments() {
      if (!user) return
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses (*)
        `)
        .eq('student_id', user.id)
        .eq('status', 'enrolled')
      
      if (!error && data) {
        setEnrolledCourses(data.map((e: any) => e.courses))
      }
      setIsLoading(false)
    }

    if (user) {
      fetchEnrollments()
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
          <h1 className="text-3xl font-bold text-slate-800">My Registered Courses</h1>
          <p className="text-muted-foreground">Your active schedule for the current term.</p>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#005cb9]" /></div>
        ) : enrolledCourses.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">No courses yet</h3>
            <p className="text-muted-foreground mb-6">You aren&apos;t currently registered for any classes.</p>
            <Link href="/courses">
              <Button className="bg-[#005cb9] hover:bg-[#004a96]">Find Course Sections</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="border-none shadow-sm h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-800 leading-tight">{course.title}</CardTitle>
                      <CardDescription className="font-bold text-[#005cb9] mt-1">{course.id}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground border-t pt-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Section TBD (Spring 2026)
                    </div>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {course.instructor || "Staff"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
