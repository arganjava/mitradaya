
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
import { MoreHorizontal, PlusCircle, Users } from "lucide-react";
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
import { programs as initialPrograms, students } from "@/lib/data";
import { Separator } from "@/components/ui/separator";

const programFormSchema = z.object({
  name: z.string().min(3, "Program name must be at least 3 characters."),
  duration: z.string().min(3, "Duration is required (e.g., '3 Months')."),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

export default function ProgramsPage() {
  const [programs, setPrograms] = React.useState(initialPrograms);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      name: "",
      duration: "",
    },
  });

  function onSubmit(data: ProgramFormValues) {
    const newProgram = {
      id: `prog-00${programs.length + 1}`,
      name: data.name,
      duration: data.duration,
    };
    setPrograms([...programs, newProgram]);

    toast({
      title: "Program Added!",
      description: `${data.name} has been successfully added.`,
    });

    form.reset();
    setIsModalOpen(false);
  }

  const programsWithStudentCount = React.useMemo(() => {
    return programs.map((program) => {
      const studentCount = students.filter(
        (s) => s.program === program.name
      ).length;
      return { ...program, studentCount };
    });
  }, [programs]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">Program Management</h1>
          <p className="text-muted-foreground mt-2">Oversee all training programs offered by your LPK.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Program</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new training program.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full-Stack Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 6 Months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Program</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>
      
      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Program List</CardTitle>
          <CardDescription>A list of all available training programs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead className="w-[150px]">Duration</TableHead>
                <TableHead className="w-[180px]">Enrolled Students</TableHead>
                <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programsWithStudentCount.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>{program.duration}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{program.studentCount} student(s)</span>
                    </div>
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

      {/* Mobile Card View */}
       <div className="space-y-4 md:hidden">
         <h3 className="text-xl font-semibold">Program List</h3>
        {programsWithStudentCount.map((program) => (
          <Card key={program.id}>
            <CardHeader className="flex-row items-start justify-between">
              <CardTitle className="text-lg leading-snug">{program.name}</CardTitle>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 -mt-2 -mr-2">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <Separator className="-mx-6 mb-4 w-auto" />
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{program.duration}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Enrolled Students</span>
                        <div className="flex items-center gap-2 font-medium">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{program.studentCount} student(s)</span>
                        </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

