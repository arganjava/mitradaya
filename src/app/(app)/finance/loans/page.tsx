
"use client";

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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { proposals, students } from "@/lib/data";
import { format } from "date-fns";

// Helper function to add ordinal suffix (st, nd, rd, th)
function getDayWithSuffix(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:  return `${day}st`;
    case 2:  return `${day}nd`;
    case 3:  return `${day}rd`;
    default: return `${day}th`;
  }
}

export default function LoansPage() {
  const approvedLoans = proposals.filter(p => p.status === 'Approved');

  const loanDetails = approvedLoans.flatMap(loan => 
    loan.studentIds.map(studentId => {
      const student = students.find(s => s.id === studentId);
      return {
        loanId: loan.id,
        student: student,
        lpkName: loan.lpkName,
        amount: loan.amount,
        submittedDate: loan.submittedDate,
        installmentDueDate: loan.installmentDueDate,
      };
    })
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">
          Loan Management
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage all active loans.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>
            A list of all approved financing proposals, detailed by student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>LPK</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Installment Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanDetails.length > 0 ? (
                  loanDetails.map((detail, index) => (
                    <TableRow key={`${detail.loanId}-${detail.student?.id || index}`}>
                      <TableCell>
                        {detail.student ? (
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={detail.student.avatar} alt={detail.student.name} data-ai-hint={detail.student.dataAiHint} />
                              <AvatarFallback>{detail.student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{detail.student.name}</p>
                              <p className="text-sm text-muted-foreground">{detail.student.email}</p>
                            </div>
                          </div>
                        ) : (
                          "Student not found"
                        )}
                      </TableCell>
                      <TableCell>{detail.lpkName}</TableCell>
                      <TableCell>{detail.amount}</TableCell>
                      <TableCell>{format(new Date(detail.submittedDate), "PPP")}</TableCell>
                      <TableCell>
                        {detail.installmentDueDate ? `${getDayWithSuffix(detail.installmentDueDate)} of each month` : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                          No active loans found.
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
