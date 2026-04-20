"use client"

import * as React from "react"
import { 
  ChevronDown, 
  Filter, 
  Search,
  BookOpen,
  Users,
  CheckCircle2,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppShell } from "@/components/layout/AppShell"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"

export default function CourseCatalogPage() {
  const { user, loading: userLoading } = useUser()
  const [courses, setCourses] = React.useState<any[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [isEnrolling, setIsEnrolling] = React.useState(false)

  // Fetch courses from Supabase
  const fetchCourses = React.useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) {
      toast.error("Failed to load courses")
    } else {
      setCourses(data || [])
    }
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error("You must be logged in to enroll")
      return
    }

    setIsEnrolling(true)
    try {
      // Call the Supabase RPC function defined in our schema
      const { error } = await supabase.rpc('enroll_student', {
        p_student_id: user.id,
        p_course_id: courseId
      })

      if (error) throw error

      toast.success(`Successfully enrolled!`)
      fetchCourses() // Refresh to update capacity
    } catch (error: any) {
      toast.error(error.message || "Enrollment failed")
    } finally {
      setIsEnrolling(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-slate-800">Course Catalog</h1>
          <p className="text-muted-foreground">Search and register for upcoming classes.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter by name or code..."
              className="pl-8 bg-white border-none shadow-sm focus-visible:ring-1 focus-visible:ring-[#005cb9]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-none shadow-sm">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="bg-white border-none shadow-sm">
                    Sort By <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Course Code</DropdownMenuItem>
                <DropdownMenuItem>Credits</DropdownMenuItem>
                <DropdownMenuItem>Instructor</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#005cb9] mx-auto mb-4" />
              <p className="text-muted-foreground">Loading course catalog...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[100px]">Course ID</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="font-semibold text-[#005cb9] break-all max-w-[150px]">{course.id}</TableCell>
                    <TableCell className="font-medium text-slate-800">{course.title}</TableCell>
                    <TableCell>{course.instructor || "Not assigned"}</TableCell>
                    <TableCell className="text-center">{course.credits}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${course.current_enrollment >= course.max_capacity ? 'bg-red-500' : 'bg-[#005cb9]'}`}
                            style={{ width: `${(course.current_enrollment / course.max_capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {course.current_enrollment} / {course.max_capacity} seats
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              Details
                            </Button>
                          }
                        />
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-[#005cb9]">{course.title}</DialogTitle>
                            <DialogDescription>
                              Course ID: {course.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-[#005cb9]" />
                                Description
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {course.description || "No description provided."}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase text-muted-foreground font-bold">Instructor</span>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-3 w-3 text-blue-500" />
                                  {course.instructor || "Staff"}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase text-muted-foreground font-bold">Credits</span>
                                <div className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                  {course.credits} Credits
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              className="w-full bg-[#005cb9] hover:bg-[#004a96]"
                              disabled={isEnrolling || course.current_enrollment >= course.max_capacity}
                              onClick={() => handleEnroll(course.id)}
                            >
                              {isEnrolling ? "Processing..." : course.current_enrollment >= course.max_capacity ? "Course Full" : "Enroll Now"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </AppShell>
  )
}
