"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Users,
  LayoutGrid,
  List
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

// Initial Mock Data
const initialCourses = [
  {
    id: "CS101",
    title: "Introduction to Computer Science",
    credits: 3,
    capacity: 50,
    enrolled: 45,
  },
  {
    id: "MATH202",
    title: "Linear Algebra",
    credits: 4,
    capacity: 35,
    enrolled: 30,
  }
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState(initialCourses)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  // Form State
  const [newCourse, setNewCourse] = React.useState({
    id: "",
    title: "",
    credits: 3,
    capacity: 30
  })

  const user = {
    name: "Admin Staff",
    email: "admin@university.edu",
    role: 'admin' as const,
  }

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const courseToAdd = {
        ...newCourse,
        enrolled: 0
      }
      setCourses([courseToAdd, ...courses])
      setIsLoading(false)
      setIsAddModalOpen(false)
      setNewCourse({ id: "", title: "", credits: 3, capacity: 30 })
      toast.success("Course added successfully!")
    }, 1000)
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="courseId">Course ID (e.g., CS101)</Label>
                    <Input 
                      id="courseId" 
                      value={newCourse.id}
                      onChange={(e) => setNewCourse({...newCourse, id: e.target.value})}
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
                  <Button type="submit" className="w-full bg-[#005cb9]" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Course"}
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
                        {course.enrolled} / {course.capacity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-[#005cb9]">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-red-600">
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
        </Card>
      </div>
    </AppShell>
  )
}
