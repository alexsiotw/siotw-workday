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
import { supabase } from "@/lib/supabase"

export default function ProgressPage() {
  const { user, loading: userLoading } = useUser()
  const [stats, setStats] = React.useState({
    totalCompleted: 0,
    required: 120,
    enrolled: 0,
  })
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchProgress() {
      if (!user) return
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          status,
          courses (credits)
        `)
        .eq('student_id', user.id)
      
      if (!error && data) {
        let completed = 0;
        let enrolled = 0;
        
        data.forEach((entry: any) => {
          const credits = entry.courses?.credits || 0;
          if (entry.status === 'completed') {
            completed += credits;
          } else if (entry.status === 'enrolled') {
            enrolled += credits;
          }
        });

        setStats(prev => ({
          ...prev,
          totalCompleted: completed,
          enrolled: enrolled
        }));
      }
      setIsLoading(false)
    }

    if (user) {
      fetchProgress()
    }
  }, [user])

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#005cb9]" />
      </div>
    )
  }

  const completedPct = Math.round((stats.totalCompleted / stats.required) * 100) || 0
  const combinedPct = Math.min(100, Math.round(((stats.totalCompleted + stats.enrolled) / stats.required) * 100)) || 0

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Academic Progress</h1>
          <p className="text-muted-foreground">Tracking your journey towards graduation based on your real course history.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-4 text-[#005cb9]" />
                <CardTitle>Degree Progress Summary</CardTitle>
              </div>
              <CardDescription>Bachelor of Science</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Credits Completed</span>
                  <span>{completedPct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#005cb9] transition-all" style={{ width: `${completedPct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  {stats.totalCompleted} of {stats.required} credits completed.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Progress Including Current Term</span>
                  <span>{combinedPct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-300 transition-all" style={{ width: `${combinedPct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Includes {stats.enrolled} credits currently in progress.
                </p>
              </div>

              <div className="pt-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Requirement Checklist</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {stats.totalCompleted >= 120 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
                    <span>120 Credits Required for Graduation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {stats.enrolled > 0 ? <CheckCircle2 className="h-4 w-4 text-blue-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
                    <span>Currently Registered for Spring 2026</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-[#005cb9] text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-white">Student Standing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div>
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">Anticipated Date</span>
                <p className="text-2xl font-bold">TBD</p>
              </div>
              <div>
                <span className="text-blue-100 text-xs uppercase font-bold tracking-wider">Classification</span>
                <p className="text-2xl font-bold italic">
                  {stats.totalCompleted < 30 ? "Freshman" : stats.totalCompleted < 60 ? "Sophomore" : stats.totalCompleted < 90 ? "Junior" : "Senior"}
                </p>
              </div>
            </CardContent>
            <GraduationCap className="absolute -bottom-8 -right-8 h-48 w-48 text-white/10" />
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
