
"use client";

import * as React from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { proposals, students, type Student } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon, DollarSign, PiggyBank, Receipt, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths } from 'date-fns';
import type { Loan } from "../page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateFinancialDetails } from "@/ai/flows/generate-financial-details-flow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";


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

interface ModalFormState {
    amount: string;
    principal: string;
    margin: string;
    startDate: Date | undefined;
    dueDate: number;
    bank: string;
}

export default function FinanceLoanDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const { toast } = useToast();
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const [loan, setLoan] = React.useState<Loan | null | undefined>(() => {
    const allLoans = proposals
        .filter(p => p.status === 'Approved')
        .flatMap(loan => 
            loan.studentIds.map(studentId => {
                const student = students.find(s => s.id === studentId);
                const amountNum = parseFloat(loan.amount.replace(/[^0-9.-]+/g,""));
                const virtualAccount = (loan as any).virtualAccounts?.[studentId];
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
                    virtualAccountNumber: virtualAccount?.number || null,
                    bank: virtualAccount?.bank || null,
                    status: 'Active',
                } as Loan;
            })
        );
    return allLoans.find(l => l.id === params.id);
  });

  const [modalFormState, setModalFormState] = React.useState<ModalFormState>({
    amount: '',
    principal: '',
    margin: '',
    startDate: undefined,
    dueDate: 1,
    bank: 'Mandiri'
  });

  const handleModalOpenChange = (open: boolean) => {
    if (open && loan) {
        setModalFormState({
            amount: loan.amount,
            principal: loan.principal,
            margin: loan.margin,
            startDate: new Date(loan.submittedDate),
            dueDate: loan.installmentDueDate,
            bank: loan.bank || 'Mandiri'
        })
    }
    setIsGeneratingModalOpen(open);
  }
  
  const handleGenerateDetails = async () => {
    if (!loan || !loan.student) return;
    setIsGenerating(true);

    try {
        const result = await generateFinancialDetails({
            loanId: loan.id,
            studentName: loan.student.name,
            lpkName: loan.lpkName,
            totalAmount: modalFormState.amount,
            bank: modalFormState.bank,
            principal: modalFormState.principal,
            margin: modalFormState.margin,
        });
        
        setLoan(prevLoan => {
            if (!prevLoan) return null;
            return {
                ...prevLoan,
                amount: modalFormState.amount,
                principal: result.principal,
                margin: result.margin,
                submittedDate: modalFormState.startDate ? modalFormState.startDate.toISOString() : prevLoan.submittedDate,
                installmentDueDate: modalFormState.dueDate,
                virtualAccountNumber: result.virtualAccountNumber,
                bank: modalFormState.bank,
            }
        });

        toast({
            title: "Details Generated",
            description: `New financial details and VA have been generated for ${loan.student.name}.`
        });

    } catch (error) {
        console.error("Error generating financial details:", error);
        toast({
            variant: 'destructive',
            title: 'Generation Failed',
            description: 'Could not generate financial details.'
        });
    } finally {
        setIsGenerating(false);
        setIsGeneratingModalOpen(false);
    }
  };


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

  const handleApprove = () => {
    toast({
      title: "Loan Approved",
      description: "The loan has been approved for disbursement.",
    });
    router.push("/finance/loans");
  };

  const handleReject = () => {
    toast({
      variant: "destructive",
      title: "Loan Rejected",
      description: "The loan has been rejected.",
    });
    router.push("/finance/loans");
  };

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
               <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-2xl">Financial Overview</CardTitle>
                  <CardDescription>A summary of the loan amounts and terms.</CardDescription>
                </div>
                <Dialog open={isGeneratingModalOpen} onOpenChange={handleModalOpenChange}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Generate Details</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Generate Financial Details & VA</DialogTitle>
                      <DialogDescription>
                        Edit details below and select a bank to regenerate financial info and a new virtual account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="space-y-2">
                            <Label htmlFor="modal-amount">Nominal Loan</Label>
                            <Input id="modal-amount" value={modalFormState.amount} onChange={(e) => setModalFormState(s => ({...s, amount: e.target.value}))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal-principal">Principal</Label>
                                <Input id="modal-principal" value={modalFormState.principal} onChange={(e) => setModalFormState(s => ({...s, principal: e.target.value}))} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-margin">Margin</Label>
                                <Input id="modal-margin" value={modalFormState.margin} onChange={(e) => setModalFormState(s => ({...s, margin: e.target.value}))} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal-start-date">Loan Start Date</Label>
                                <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    id="modal-start-date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !modalFormState.startDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {modalFormState.startDate ? format(modalFormState.startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={modalFormState.startDate}
                                    onSelect={(date) => setModalFormState(s => ({...s, startDate: date || undefined}))}
                                    initialFocus
                                    />
                                </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-due-date">Installment Due Date</Label>
                                <Input id="modal-due-date" type="number" value={modalFormState.dueDate} onChange={(e) => setModalFormState(s => ({...s, dueDate: parseInt(e.target.value) || 1}))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank-select">Bank</Label>
                            <Select value={modalFormState.bank} onValueChange={(value) => setModalFormState(s => ({...s, bank: value}))}>
                            <SelectTrigger id="bank-select">
                                <SelectValue placeholder="Select a bank" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BCA">BCA</SelectItem>
                                <SelectItem value="BNI">BNI</SelectItem>
                                <SelectItem value="Mandiri">Mandiri</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsGeneratingModalOpen(false)}>Cancel</Button>
                      <Button onClick={handleGenerateDetails} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
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
                         {loan.virtualAccountNumber ? (
                            <div className="text-right">
                                <span className="font-mono font-medium">{loan.virtualAccountNumber}</span>
                                <p className="text-xs text-muted-foreground">{loan.bank}</p>
                            </div>
                        ) : (
                            <span className="font-mono font-medium">N/A</span>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="destructive" onClick={handleReject}>Reject Loan</Button>
                <Button onClick={handleApprove}>Approve Loan</Button>
            </CardFooter>
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
