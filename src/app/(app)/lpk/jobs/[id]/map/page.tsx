
"use client";

import * as React from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { jobs as initialJobs, students } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// This is a temporary solution to persist data changes across pages.
// In a real app, you would use a state management library, context, or fetch/mutate data from a server.
const updateJobInMockDB = (jobId: string, studentIds: string[]) => {
    const jobIndex = initialJobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
        initialJobs[jobIndex].studentIds = studentIds;
    }
};


export default function MapStudentsToJobPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const { toast } = useToast();

  // Find the job from our mock data
  const job = React.useMemo(() => initialJobs.find(j => j.id === params.id), [params.id]);

  const [mappedStudentIds, setMappedStudentIds] = React.useState<string[]>(job?.studentIds || []);

  if (!job) {
    notFound();
  }

  const handleSaveMapping = () => {
    // In a real app, this would be an API call.
    // For now, we'll mutate the mock data directly.
    updateJobInMockDB(job.id, mappedStudentIds);

    toast({
      title: "Mapping Updated!",
      description: `Students have been successfully mapped to "${job.title}".`,
    });

    // Navigate back to the jobs list
    router.push("/lpk/jobs");
  };

  return (
    <div className="space-y-6">
       <Link href="/lpk/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Job List
        </Link>
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">Map Students to Job</h1>
        <p className="text-muted-foreground mt-2">
          Select students to assign to the <span className="font-semibold text-foreground">"{job.title}"</span> job order.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Select Students</CardTitle>
            <CardDescription>Check the box next to each student you want to map to this job.</CardDescription>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-[50vh] border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Program</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>
                            <Checkbox
                                id={`student-${student.id}`}
                                checked={mappedStudentIds.includes(student.id)}
                                onCheckedChange={(checked) => {
                                setMappedStudentIds(prev =>
                                    checked
                                    ? [...prev, student.id]
                                    : prev.filter(id => id !== student.id)
                                );
                                }}
                            />
                            </TableCell>
                            <TableCell>
                            <label htmlFor={`student-${student.id}`} className="flex items-center gap-3 cursor-pointer">
                                <Avatar>
                                <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.dataAiHint} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{student.name}</span>
                            </label>
                            </TableCell>
                            <TableCell>{student.program}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => router.push('/lpk/jobs')}>Cancel</Button>
                <Button onClick={handleSaveMapping}>Save Mapping</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
