"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { students as initialStudents } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const addStudentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  program: z.string().min(3, "Program name is required."),
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

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      program: "",
    },
  });

  function onSubmit(data: AddStudentFormValues) {
    const newStudent = {
      id: `std-00${students.length + 1}`,
      ...data,
      status: "Active",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "student portrait",
      enrollmentDate: new Date().toISOString().split('T')[0],
      progress: 0,
      contact: { phone: "", address: "" },
      grades: {}
    };
    setStudents([...students, newStudent]);

    toast({
      title: "Student Added!",
      description: `${data.name} has been successfully added.`,
    });

    form.reset();
    setIsModalOpen(false);
  }

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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Fill in the details below to enroll a new student.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Program / Course</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Digital Marketing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Program</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
