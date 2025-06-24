"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { students as initialStudents, programs } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AtSign, Calendar, GraduationCap, Percent, Phone, Pin, Cake, Users, PlusCircle, Camera, FileText } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";


const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Active": "default",
  "Completed": "secondary",
  "Withdrawn": "destructive"
};

const gradeFormSchema = z.object({
  module: z.string().min(1, "Please select a module."),
  grade: z.string().min(1, "Grade is required (e.g., A, B+, In Progress)."),
});

type GradeFormValues = z.infer<typeof gradeFormSchema>;


export default function StudentDetailPage() {
  const params = useParams() as { id: string };
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [student, setStudent] = React.useState(() => 
    initialStudents.find(s => s.id === params.id)
  );

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      module: "",
      grade: "",
    },
  });

  if (!student) {
    notFound();
  }

  function onAddGrade(data: GradeFormValues) {
    setStudent(prevStudent => {
        if (!prevStudent) return prevStudent;
        const newGrades = { ...prevStudent.grades, [data.module]: data.grade };
        return { ...prevStudent, grades: newGrades };
    });

    toast({
        title: "Grade Added!",
        description: `Grade for "${data.module}" has been added successfully.`,
    });

    form.reset();
    setIsModalOpen(false);
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setStudent(prev => {
                if (!prev) return prev;
                return { ...prev, avatar: reader.result as string };
            });
            toast({
                title: "Photo Updated",
                description: "The student's photo has been changed.",
            });
        };
        reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-6 md:space-y-8">
       <Link href="/lpk/students" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Student List
        </Link>
        
      <header className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6">
        <div className="relative">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 text-4xl">
                <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.dataAiHint} />
                <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
             <Button asChild size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 cursor-pointer">
                <label htmlFor="avatarInput">
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change Photo</span>
                </label>
            </Button>
            <input type="file" id="avatarInput" className="hidden" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className="flex-grow">
            <div className="flex items-center justify-center md:justify-start gap-4">
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{student.name}</h1>
                <Badge variant={statusVariant[student.status] || 'default'} className="text-sm">{student.status}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground justify-center md:justify-start">
                <GraduationCap className="w-5 h-5" />
                <p className="text-lg">{student.program}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground justify-center md:justify-start">
                 <Calendar className="w-4 h-4" />
                <span>Enrolled on {new Date(student.enrollmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2"><Percent className="w-6 h-6 text-primary" /> Program Progress</CardTitle>
                        <CardDescription>View and manage student grades and modules.</CardDescription>
                    </div>
                     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Grade
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add New Grade</DialogTitle>
                                <DialogDescription>
                                    Enter the module name and the grade received by the student.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                            <form onSubmit={form.handleSubmit(onAddGrade)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="module"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Module Name</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a module/program" />
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
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Grade</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., A+, In Progress, 95" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save Grade</Button>
                                </DialogFooter>
                            </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Progress value={student.progress} className="w-full h-3" />
                            <span className="font-bold text-primary text-lg">{student.progress}%</span>
                        </div>
                        <Separator />
                        <h4 className="font-semibold text-lg">Grades & Modules</h4>
                         <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                            {Object.entries(student.grades).map(([module, grade]) => (
                                <div key={module} className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{module}</span>
                                    <span className="font-medium">{grade}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" /> Student Documents
                    </CardTitle>
                    <CardDescription>
                        Manage student's identity card (KTP), family card (KK), and last diploma (Ijazah).
                    </CardDescription>
                </CardHeader>
                 <CardContent className="space-y-6">
                     <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium text-base">KTP (Kartu Tanda Penduduk)</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ktpNumber">Nomor KTP</Label>
                                <Input id="ktpNumber" placeholder="e.g., 3171234567890001" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ktpFile">Upload File KTP</Label>
                                <Input id="ktpFile" type="file" />
                            </div>
                        </div>
                    </div>
                    
                     <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium text-base">KK (Kartu Keluarga)</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="kkNumber">Nomor KK</Label>
                                <Input id="kkNumber" placeholder="e.g., 3171234567890002" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kkFile">Upload File KK</Label>
                                <Input id="kkFile" type="file" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium text-base">Ijazah Terakhir</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="schoolName">Nama Sekolah</Label>
                                <Input id="schoolName" placeholder="e.g., SMA Negeri 1 Jakarta" defaultValue={student.previousEducation} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="ijazahFile">Upload File Ijazah</Label>
                                <Input id="ijazahFile" type="file" />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save Documents</Button>
                </CardFooter>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Personal & Family</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-start gap-3">
                        <Cake className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div className="text-sm">
                            <p className="font-medium">Date of Birth</p>
                            <p className="text-muted-foreground">{new Date(student.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div className="text-sm">
                            <p className="font-medium">Parent's Name</p>
                            <p className="text-muted-foreground">{student.parentName}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <GraduationCap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div className="text-sm">
                            <p className="font-medium">Previous Education</p>
                            <p className="text-muted-foreground">{student.previousEducation}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <AtSign className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <a href={`mailto:${student.email}`} className="text-sm hover:underline break-all">{student.email}</a>
                    </div>
                     <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm">{student.contact.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Pin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-sm">{student.contact.address}</span>
                    </div>
                </CardContent>
            </Card>
            <Button className="w-full">Contact Student</Button>
        </div>
      </div>
    </div>
  );
}

    