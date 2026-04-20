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
  User
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

export default function DashboardPage() {
  // Mock user data
  const user = {
    name: "Alex Smith",
    email: "alex.smith@university.edu",
    role: 'student' as const,
  }

  const enrolledCourses = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Alan Turing",
      time: "Mon/Wed 10:00 AM - 11:30 AM",
      location: "Building A, Room 101",
      credits: 3
    },
    {
      id: "MATH202",
      name: "Linear Algebra",
      instructor: "Dr. Emmy Noether",
      time: "Tue/Thu 1:00 PM - 2:30 PM",
      location: "Science Hall, Room 204",
      credits: 4
    }
  ]

  return (
    <AppShell user={user}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#005cb9] p-8 text-white shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold md:text-4xl">Welcome back, {user.name}!</h1>
            <p className="mt-2 text-blue-100 opacity-90">
              You are currently enrolled in {enrolledCourses.length} courses for the Spring 2026 semester.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button className="bg-white text-[#005cb9] hover:bg-blue-50">
                <Search className="mr-2 h-4 w-4" />
                Register for Classes
              </Button>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Credits Earned</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92 / 120</div>
              <p className="text-xs text-muted-foreground">76% of degree complete</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Assignments due this week</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Career Fair on Friday</p>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Current Enrolled Courses</h2>
            <Button variant="ghost" className="text-[#005cb9]">View Full Schedule</Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="group border-none shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-slate-800">{course.name}</CardTitle>
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
                      {course.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {course.location}
                    </div>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {course.instructor}
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
        </div>
      </div>
    </AppShell>
  )
}
