"use client"

import * as React from "react"
import { 
  BarChart3, 
  CheckCircle2, 
  Circle, 
  GraduationCap,
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
import { useUser } from "@/hooks/use-user"

export default function ProgressPage() {
  const { user, loading: userLoading } = useUser()
  const [stats, setStats] = React.useState({
    totalCompleted: 45,
    required: 120,
    gpa: 3.85
  })

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#005cb9]" />
      </div>
    )
  }

  const percentage = Math.round((stats.totalCompleted / stats.required) * 100)

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Academic Progress</h1>
          <p className="text-muted-foreground">Tracking your journey towards graduation.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-4 text-[#005cb9]" />
                <CardTitle>Degree Progress Summary</CardTitle>
              </div>
              <CardDescription>Bachelor of Science in Computer Science</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>General Education</span>
                  <span>75%</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#005cb9] transition-all" style={{ width: '75%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Major Requirements</span>
                  <span>30%</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#005cb9] transition-all" style={{ width: '30%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Total Credits</span>
                  <span>{percentage}%</span>
                </div>
                {/* Custom Progress Bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#005cb9] transition-all" style={{ width: `${percentage}%` }} />
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  {stats.totalCompleted} of {stats.required} credits completed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-[#005cb9] text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-white">Graduation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div>
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">Anticipated Date</span>
                <p className="text-2xl font-bold">May 2028</p>
              </div>
              <div>
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">Current Standing</span>
                <p className="text-2xl font-bold italic">Sophomore</p>
              </div>
              <div className="pt-4">
                <Button variant="secondary" className="w-full text-[#005cb9] font-bold">Apply for Graduation</Button>
              </div>
            </CardContent>
            <GraduationCap className="absolute -bottom-8 -right-8 h-48 w-48 text-white/10" />
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
