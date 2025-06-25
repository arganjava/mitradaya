
"use client";

import * as React from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { proposals, students, type Student } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, DollarSign, PiggyBank, Receipt, Hash } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths } from 'date-fns';
import type { Loan } from "../page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Active: "default",
  'Paid Off': "secondary",
  Overdue: "destructive",
};

const paymentStatusVariant: { [key: string]: "secondary" | "destructive" } = {
    Paid: "secondary",
    Due: "destructive",
};

// Helper function to add ordinal suffix
function getDayWithSuffix(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:  return `${day}st`;
    case 2:  return `${day}nd`;
    case 3:  return `${day}rd`;
    default: return `${day}th`;
  }
}

export default function FinanceLoanDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();
  
  // Re-generate the full loans list to find the one matching the ID
  // This is a workaround for prototype state management
  const loan = React.useMemo(() => {
    const allLoans = proposals
        .filter(p => p.status === 'Approved')
        .flatMap(loan => 
            loan.studentIds.map(studentId => {
                const student = students.find(s => s.id === studentId);
                const amountNum = parseFloat(loan.amount.replace(/[^0-9.-]+/g,""));
                return {
                    id: `${loan.id}-${studentId}`,
                    student: student,
                    lpkName: loan.lpkName,
                    amount: loan.amount,
                    principal: `Rp ${(amountNum * 0.9).toLocaleString('id-ID')}`,
                    margin: `Rp ${(amountNum * 0.1).toLocaleString('id-ID')}`,
                    estimatedInstallment: `Rp ${(amountNum / 12).toLocaleString('id-ID', {maximumFractionDigits: 0})}`,
                    submittedDate: loan.submittedDate,
                    installmentDueDate: loan.installmentDueDate,
                    virtualAccountNumber: loan.virtualAccountNumbers?.[studentId] || null,
                    status: 'Active',
                } as Loan;
            })
        );
    return allLoans.find(l => l.id === params.id);
  }, [params.id]);

  const paymentHistory = React.useMemo(() => {
    if (!loan) return [];
    const history = [];
    const startDate = new Date(loan.submittedDate);
    
    for (let i = 0; i < 10; i++) {
      const dueDate = addMonths(startDate, i);
      dueDate.setDate(loan.installmentDueDate);
      
      const status = i < 5 ? 'Paid' : 'Due';
      const paymentDate = status === 'Paid' ? new Date(dueDate) : null;

      history.push({
        id: `payment-${i + 1}`,
        month: format(dueDate, 'MMMM yyyy'),
        dueDate: format(dueDate, 'PPP'),
        amount: loan.estimatedInstallment,
        status: status,
        paymentDate: paymentDate ? format(paymentDate, 'PPP') : 'N/A',
      });
    }
    return history;
  }, [loan]);


  if (!loan || !loan.student) {
    notFound();
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <Link href="/finance/loans" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to All Loans
      </Link>
      
      <header>
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">Loan Details</h1>
        <p className="text-muted-foreground mt-2">
          Managing loan for <span className="font-semibold text-foreground">{loan.student.name}</span>.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Financial Overview</CardTitle>
               <CardDescription>A summary of the loan amounts and terms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-lg">{loan.amount}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <PiggyBank className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Principal</p>
                            <p className="font-semibold text-lg">{loan.principal}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Receipt className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                            <p className="text-muted-foreground">Margin</p>
                            <p className="font-semibold text-lg">{loan.margin}</p>
                        </div>
                    </div>
                </div>
                 <Separator className="my-6" />
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Installment per Month</span>
                        <span className="font-medium">{loan.estimatedInstallment}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Installment Due Date</span>
                        <span className="font-medium">{getDayWithSuffix(loan.installmentDueDate)} of each month</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan Start Date</span>
                        <span className="font-medium">{format(new Date(loan.submittedDate), "PPP")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Virtual Account</span>
                        <span className="font-mono font-medium">{loan.virtualAccountNumber ?? 'N/A'}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
                <CardTitle className="font-headline text-2xl">Payment History</CardTitle>
                <CardDescription>A record of monthly installment payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Period</TableHead>
                            <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="hidden sm:table-cell text-right">Payment Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentHistory.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>
                                    <div className="font-medium">{payment.month}</div>
                                    <div className="text-muted-foreground sm:hidden text-xs">{payment.dueDate}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">{payment.dueDate}</TableCell>
                                <TableCell className="text-right">{payment.amount}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={paymentStatusVariant[payment.status]}>
                                        {payment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-right">{payment.paymentDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Borrower Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={loan.student.avatar} alt={loan.student.name} data-ai-hint={loan.student.dataAiHint} />
                        <AvatarFallback>{loan.student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-lg">{loan.student.name}</p>
                        <p className="text-sm text-muted-foreground">{loan.student.email}</p>
                    </div>
               </div>
               <Separator />
               <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">LPK</span>
                        <span className="font-medium">{loan.lpkName}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Loan ID</span>
                        <span className="font-mono text-xs">{loan.id}</span>
                    </div>
               </div>
            </CardContent>
             <CardFooter>
                 <Button variant="outline" className="w-full">View Full Profile</Button>
            </CardFooter>
          </Card>
          <Card>
             <CardHeader>
              <CardTitle className="font-headline text-xl">Loan Status & Actions</CardTitle>
            </CardHeader>
             <CardContent className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Current Status</p>
                  <Badge variant={statusVariant[loan.status] || "default"}>{loan.status}</Badge>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full">Mark as Paid Off</Button>
                <Button className="w-full" variant="outline">Send Reminder</Button>
                <Button className="w-full" variant="destructive">Flag as Overdue</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
