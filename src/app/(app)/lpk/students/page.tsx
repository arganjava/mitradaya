
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Calendar as CalendarIcon, Search, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { students as initialStudents, programs, type Student } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const addStudentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  program: z.string({ required_error: "Please select a program." }),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().min(10, "Please enter a valid home address."),
  parentName: z.string().min(2, "Parent's name is required."),
  previousEducation: z.string().min(3, "Previous education is required."),
});

type AddStudentFormValues = z.infer<typeof addStudentFormSchema>;

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Active": "default",
  "Completed": "secondary",
  "Withdrawn": "destructive"
};

export default function StudentsPage() {
  const [students, setStudents] = React.useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [programFilter, setProgramFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const [sorting, setSorting] = React.useState<{ column: keyof Pick<Student, 'name' | 'program' | 'status' | 'enrollmentDate'>; direction: 'asc' | 'desc' }>({ column: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const studentsPerPage = 10;

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      program: "",
      phone: "",
      address: "",
      parentName: "",
      previousEducation: "",
    },
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, programFilter, statusFilter, sorting]);


  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSort = (column: keyof Pick<Student, 'name' | 'program' | 'status' | 'enrollmentDate'>) => {
    setSorting(prevSorting => ({
      column,
      direction: prevSorting.column === column && prevSorting.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  function onSubmit(data: AddStudentFormValues) {
    const newStudent = {
      id: `std-00${students.length + 1}`,
      name: data.name,
      email: data.email,
      program: data.program,
      status: "Active",
      avatar: avatarPreview || "https://placehold.co/100x100.png",
      dataAiHint: "student portrait",
      enrollmentDate: new Date().toISOString().split('T')[0],
      dateOfBirth: data.dateOfBirth.toISOString().split('T')[0],
      previousEducation: data.previousEducation,
      parentName: data.parentName,
      progress: 0,
      contact: { 
        phone: data.phone,
        address: data.address,
       },
      grades: {}
    };
    setStudents([...students, newStudent]);

    toast({
      title: "Student Added!",
      description: `${data.name} has been successfully added.`,
    });

    form.reset();
    setAvatarPreview(null);
    setIsModalOpen(false);
  }

  const processedStudents = React.useMemo(() => {
    let processed = students
      .filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(student =>
        programFilter === "all" || student.program === programFilter
      )
      .filter(student =>
        statusFilter === "all" || student.status === statusFilter
      );

    processed.sort((a, b) => {
        const aValue = a[sorting.column];
        const bValue = b[sorting.column];
        if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    return processed;
  }, [students, searchQuery, programFilter, statusFilter, sorting]);

  const totalPages = Math.ceil(processedStudents.length / studentsPerPage);

  const paginatedStudents = React.useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    return processedStudents.slice(startIndex, startIndex + studentsPerPage);
  }, [processedStudents, currentPage]);


  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">Student Management</h1>
          <p className="text-muted-foreground mt-2">Manage all students enrolled in your LPK.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Fill in the details below to enroll a new student.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto p-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Budi Hartono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="e.g., student@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Program / Course</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {programs.map((program) => (
                              <SelectItem key={program.id} value={program.name}>
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 08123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Full address including city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Slamet Hartono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="previousEducation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Education</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SMA Negeri 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormItem className="sm:col-span-2">
                        <FormLabel>Student Photo</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={handleAvatarChange} className="cursor-pointer" />
                        </FormControl>
                        {avatarPreview && (
                            <div className="mt-2">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarPreview} alt="Avatar Preview" />
                                    <AvatarFallback>P</AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                        <FormMessage />
                    </FormItem>
                </div>
                <DialogFooter>
                  <Button type="submit">Enroll Student</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A list of all current and past students.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by student name..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
                <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Filter by program" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {programs.map(program => (
                    <SelectItem key={program.id} value={program.name}>{program.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('name')} className="px-1">
                      Name
                      {sorting.column === 'name' ? (
                          sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                      ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                     <Button variant="ghost" onClick={() => handleSort('program')} className="px-1">
                      Program
                      {sorting.column === 'program' ? (
                          sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                      ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                     <Button variant="ghost" onClick={() => handleSort('status')} className="px-1">
                      Status
                       {sorting.column === 'status' ? (
                          sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                      ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                     <Button variant="ghost" onClick={() => handleSort('enrollmentDate')} className="px-1">
                      Enrolled
                       {sorting.column === 'enrollmentDate' ? (
                          sorting.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4 inline-block" /> : <ArrowDown className="ml-2 h-4 w-4 inline-block" />
                      ) : <span className="ml-2 h-4 w-4 inline-block" />}
                    </Button>
                  </TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.dataAiHint} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                {student.name}
                                <div className="text-sm text-muted-foreground md:hidden">{student.program}</div>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{student.program}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={statusVariant[student.status] || 'default'}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(new Date(student.enrollmentDate), "PPP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/lpk/students/${student.id}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                    Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                    Next
                    </Button>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    