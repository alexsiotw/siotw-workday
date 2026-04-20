"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Users,
  LayoutGrid,
  List,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { AppShell } from "@/components/layout/AppShell"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"

export default function AdminCoursesPage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [courses, setCourses] = React.useState<any[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  // Form State
  const [newCourse, setNewCourse] = React.useState({
    id: "",
    title: "",
    credits: 3,
    capacity: 30,
    instructor: "",
    description: ""
  })

  const fetchCourses = React.useCallback(async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      toast.error("Failed to load courses")
    } else {
      setCourses(data || [])
    }
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    if (!userLoading && (!user || user.role !== 'admin')) {
      // Basic protection - though Middleware is better
      toast.error("Unauthorized access")
      router.push("/dashboard")
      return
    }
    fetchCourses()
  }, [user, userLoading, fetchCourses, router])

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          id: newCourse.id,
          title: newCourse.title,
          credits: newCourse.credits,
          max_capacity: newCourse.capacity,
          instructor: newCourse.instructor,
          description: newCourse.description
        })

      if (error) throw error

      toast.success("Course added successfully!")
      setIsAddModalOpen(false)
      setNewCourse({ id: "", title: "", credits: 3, capacity: 30, instructor: "", description: "" })
      fetchCourses()
    } catch (error: any) {
      toast.error(error.message || "Failed to add course")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This will remove all student enrollments.")) return

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error

      toast.success("Course deleted")
      fetchCourses()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete course")
    }
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Course Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove courses from the catalog.</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger
              render={
                <Button className="bg-[#005cb9] hover:bg-[#004a96]">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Course
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleAddCourse}>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new course.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="grid gap-2">
                    <Label htmlFor="courseId">Course ID (e.g., CS101)</Label>
                    <Input 
                      id="courseId" 
                      value={newCourse.id}
                      onChange={(e) => setNewCourse({...newCourse, id: e.target.value})}
                      placeholder="e.g. CS101"
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input 
                      id="title" 
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      placeholder="e.g. Introduction to Physics"
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="instructor">Instructor Name</Label>
                    <Input 
                      id="instructor" 
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                      placeholder="e.g. Dr. Emily Carter"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      placeholder="Brief overview of the course..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="credits">Credits</Label>
                      <Input 
                        id="credits" 
                        type="number" 
                        value={newCourse.credits}
                        onChange={(e) => setNewCourse({...newCourse, credits: parseInt(e.target.value)})}
                        min="1" 
                        max="10" 
                        required 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Max Capacity</Label>
                      <Input 
                        id="capacity" 
                        type="number" 
                        value={newCourse.capacity}
                        onChange={(e) => setNewCourse({...newCourse, capacity: parseInt(e.target.value)})}
                        min="1" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-[#005cb9]" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Course"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-8 bg-white border-none shadow-sm focus-visible:ring-1 focus-visible:ring-[#005cb9]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center border rounded-md bg-white p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-blue-50 text-[#005cb9]">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#005cb9] mx-auto mb-4" />
              <p className="text-muted-foreground">Refreshing courses...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Enrollment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-semibold text-[#005cb9]">{course.id}</TableCell>
                    <TableCell className="font-medium text-slate-800">{course.title}</TableCell>
                    <TableCell className="text-center">{course.credits}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {course.current_enrollment} / {course.max_capacity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-[#005cb9]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-600 hover:text-red-600"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No courses found matching your search.
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
