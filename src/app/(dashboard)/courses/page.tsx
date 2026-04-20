"use client"

import * as React from "react"
import { 
  ChevronDown, 
  Filter, 
  MoreHorizontal, 
  Search,
  BookOpen,
  Users,
  Clock,
  CheckCircle2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

// Mock Course Data
const courses = [
  {
    id: "CS101",
    title: "Introduction to Computer Science",
    credits: 3,
    instructor: "Dr. Alan Turing",
    capacity: 50,
    enrolled: 45,
    description: "Fundamental concepts of computer science including algorithms, data structures, and problem solving."
  },
  {
    id: "MATH202",
    title: "Linear Algebra",
    credits: 4,
    instructor: "Dr. Emmy Noether",
    capacity: 35,
    enrolled: 30,
    description: "Study of vector spaces, linear transformations, matrices, and determinants."
  },
  {
    id: "BIO305",
    title: "Molecular Biology",
    credits: 4,
    instructor: "Dr. Rosalind Franklin",
    capacity: 25,
    enrolled: 22,
    description: "Exploration of biological processes at the molecular level, focusing on DNA, RNA, and protein synthesis."
  },
  {
    id: "ENG110",
    title: "World Literature",
    credits: 3,
    instructor: "Prof. Chinua Achebe",
    capacity: 40,
    enrolled: 15,
    description: "A survey of significant literary works from various cultures and historical periods."
  },
  {
    id: "PHYS201",
    title: "General Physics I",
    credits: 4,
    instructor: "Dr. Marie Curie",
    capacity: 60,
    enrolled: 60,
    description: "Introduction to mechanics, heat, and sound for science and engineering majors."
  },
  {
    id: "ECON101",
    title: "Principles of Economics",
    credits: 3,
    instructor: "Adam Smith",
    capacity: 100,
    enrolled: 85,
    description: "An overview of microeconomic and macroeconomic theories and applications."
  }
]

export default function CourseCatalogPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState<typeof courses[0] | null>(null)
  
  const user = {
    name: "Alex Smith",
    email: "alex.smith@university.edu",
    role: 'student' as const,
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEnroll = (courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (course && course.enrolled >= course.capacity) {
      toast.error("Enrollment failed: Course is at maximum capacity.")
      return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success(`Successfully enrolled in ${courseId}!`)
    }, 1500)
  }

  const [isLoading, setIsLoading] = React.useState(false)

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
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white border-none shadow-sm">
                  Sort By <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
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
                  <TableCell className="font-semibold text-[#005cb9]">{course.id}</TableCell>
                  <TableCell className="font-medium text-slate-800">{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell className="text-center">{course.credits}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${course.enrolled >= course.capacity ? 'bg-red-500' : 'bg-[#005cb9]'}`}
                          style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {course.enrolled} / {course.capacity} seats
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                        >
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="text-[#005cb9]">{course.id}: {course.title}</DialogTitle>
                          <DialogDescription>
                            Provided by Department of {course.id.startsWith('CS') ? 'Computer Science' : course.id.startsWith('MATH') ? 'Mathematics' : 'General Sciences'}.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-[#005cb9]" />
                              Description
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {course.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase text-muted-foreground font-bold">Instructor</span>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-3 w-3 text-blue-500" />
                                {course.instructor}
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
                            disabled={isLoading || course.enrolled >= course.capacity}
                            onClick={() => handleEnroll(course.id)}
                          >
                            {isLoading ? "Processing..." : course.enrolled >= course.capacity ? "Course Full" : "Enroll Now"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  )
}
