
"use client";

import * as React from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { proposals, students, type Student } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Users as StudentsIcon, DollarSign, AtSign, Phone, Pin, Cake, GraduationCap } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Approved": "default",
  "Pending": "secondary",
  "Rejected": "destructive"
};

function StudentDetailModal({ student, open, onOpenChange }: { student: Student | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.dataAiHint} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-bold">{student.name}</DialogTitle>
              <DialogDescription>{student.program}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Contact & Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <AtSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <a href={`mailto:${student.email}`} className="hover:underline break-all">{student.email}</a>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{student.contact.phone}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Cake className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>Born on {format(new Date(student.dateOfBirth), "PPP")}</span>
                </div>
                <div className="flex items-start gap-3">
                    <Pin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <span>{student.contact.address}</span>
                </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><StudentsIcon className="w-5 h-5 text-primary" /> Family & Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                        <p className="text-muted-foreground text-xs">Parent's Name</p>
                        <p className="font-medium">{student.parentName}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                     <div>
                        <p className="text-muted-foreground text-xs">Last Diploma (Ijazah)</p>
                        <p className="font-medium">{student.previousEducation}</p>
                    </div>
                </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">KTP Number</span>
                    <span className="font-mono font-medium">{student.ktpNumber || 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">KK Number</span>
                    <span className="font-mono font-medium">{student.kkNumber || 'N/A'}</span>
                </div>
            </CardContent>
          </Card>

        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function FinanceProposalDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);

  const proposal = React.useMemo(() => proposals.find((p) => p.id === params.id), [params.id]);

  const includedStudents = React.useMemo(() => {
    if (!proposal) return [];
    return students.filter((s) => proposal.studentIds.includes(s.id));
  }, [proposal]);

  if (!proposal) {
    notFound();
  }
  
  const handleApprove = () => {
    // In a real app, this would be a server action to update the proposal status
    toast({
      title: "Proposal Approved",
      description: `The proposal from ${proposal.lpkName} has been marked as approved.`,
    });
    // Optimistically update status or refetch data
    router.push('/finance');
  };

  const handleReject = () => {
    // In a real app, this would be a server action
    toast({
      title: "Proposal Rejected",
      description: `The proposal from ${proposal.lpkName} has been marked as rejected.`,
      variant: 'destructive',
    });
     router.push('/finance');
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <Link href="/finance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Proposals
      </Link>
      
      <header>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">Proposal Details</h1>
        <p className="text-muted-foreground mt-2">
          Reviewing application from <span className="font-semibold text-foreground">{proposal.lpkName}</span>.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Student Profiles ({proposal.studentCount})</CardTitle>
               <CardDescription>The following students are included in this financing proposal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {includedStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                   <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar} alt={student.name} data-ai-hint={student.dataAiHint} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.program}</p>
                        </div>
                   </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                      View Profile
                      <User className="ml-2 h-4 w-4" />
                    </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Summary & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Amount Requested</p>
                    <p className="font-semibold text-lg">{proposal.amount}</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                  <StudentsIcon className="w-5 h-5 text-primary flex-shrink-0" />
                   <div>
                    <p className="text-muted-foreground">Number of Students</p>
                    <p className="font-semibold">{proposal.studentCount}</p>
                  </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                   <div>
                    <p className="text-muted-foreground">Submitted On</p>
                    <p className="font-semibold">{format(new Date(proposal.submittedDate), "PPP")}</p>
                  </div>
              </div>
              <Separator />
               <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">Current Status</p>
                  <Badge variant={statusVariant[proposal.status] || "default"}>{proposal.status}</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleApprove} disabled={proposal.status !== 'Pending'}>Approve</Button>
                <Button className="w-full" variant="destructive" onClick={handleReject} disabled={proposal.status !== 'Pending'}>Reject</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <StudentDetailModal 
        student={selectedStudent} 
        open={!!selectedStudent} 
        onOpenChange={(open) => !open && setSelectedStudent(null)} 
      />
    </div>
  );
}
