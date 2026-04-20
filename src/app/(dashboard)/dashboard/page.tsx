"use client"

import * as React from "react"
import { 
  CalendarDays, 
  GraduationCap, 
  Search, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  MapPin,
  User,
  Loader2
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

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const [enrolledCourses, setEnrolledCourses] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchEnrollments = React.useCallback(async () => {
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
  }, [user])

  React.useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  const totalCredits = enrolledCourses.reduce((acc, course) => acc + (course.credits || 0), 0)

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
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#005cb9] p-8 text-white shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold md:text-4xl text-white">Welcome back, {user?.name || "Student"}!</h1>
            <p className="mt-2 text-blue-100 opacity-90">
              {enrolledCourses.length > 0 
                ? `You are currently enrolled in ${enrolledCourses.length} courses for the Spring 2026 semester.`
                : "Welcome to SIOTW Workday! Head over to the Course Catalog to start registering."
              }
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/courses">
                <Button className="bg-white text-[#005cb9] hover:bg-blue-50 border-none">
                  <Search className="mr-2 h-4 w-4" />
                  Register for Classes
                </Button>
              </Link>
              <Button variant="outline" className="border-blue-200 text-white hover:bg-blue-700 hover:text-white">
                View Academic Record
              </Button>
            </div>
          </div>
          <GraduationCap className="absolute -bottom-8 -right-8 h-64 w-64 text-white/10" />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current GPA</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.85</div>
              <p className="text-xs text-muted-foreground">+0.1 from last semester</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Credits Enrolled</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCredits}</div>
              <p className="text-xs text-muted-foreground">Spring 2026 Term</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Academic Status</CardTitle>
              <CalendarDays className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold italic">Good</div>
              <p className="text-xs text-muted-foreground">Full-time status</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Current Enrolled Courses</h2>
            <Button variant="ghost" className="text-[#005cb9]">View Full Schedule</Button>
          </div>
          
          {isLoading ? (
            <Card className="p-12 flex flex-col items-center justify-center border-none shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-[#005cb9] mb-4" />
              <p className="text-muted-foreground">Updating your schedule...</p>
            </Card>
          ) : enrolledCourses.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600">No courses yet</h3>
              <p className="text-muted-foreground mb-6">You haven&apos;t registered for any classes for this term.</p>
              <Link href="/courses">
                <Button className="bg-[#005cb9] hover:bg-[#004a96]">Explore Catalog</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="group border-none shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-slate-800">{course.title}</CardTitle>
                        <CardDescription className="font-medium text-[#005cb9]">{course.id}</CardDescription>
                      </div>
                      <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#005cb9]">
                        Enrolled
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        TBD (Mon/Wed schedule)
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Building A, Room TBA
                      </div>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {course.instructor || "Staff"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-xs font-medium text-muted-foreground">{course.credits} Credits</span>
                      <Button variant="outline" size="sm" className="text-xs">Course Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
