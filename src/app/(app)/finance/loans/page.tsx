
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Copy, Loader2 } from "lucide-react";
import { proposals, students, type Student } from "@/lib/data";
import { generateVirtualAccount, type GenerateVAInput } from "@/ai/flows/generate-va-flow";

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

// Zod schema for the loan form
const loanFormSchema = z.object({
  lpkName: z.string({ required_error: "Please select an LPK." }),
  studentId: z.string({ required_error: "Please select a student." }),
  amount: z.string().min(1, "Loan amount is required."),
  installmentDueDate: z.coerce.number().min(1).max(28, "Due date must be between 1 and 28."),
});

type LoanFormValues = z.infer<typeof loanFormSchema>;

export type Loan = {
  id: string;
  student: Student | undefined;
  lpkName: string;
  amount: string;
  principal: string;
  margin: string;
  estimatedInstallment: string;
  submittedDate: string;
  installmentDueDate: number;
  virtualAccountNumber: string | null;
  bank: string | null;
  status: 'Active' | 'Paid Off' | 'Overdue';
};

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Active: "default",
  'Paid Off': "secondary",
  Overdue: "destructive",
};

export default function LoansPage() {
  const { toast } = useToast();
  const [loans, setLoans] = React.useState<Loan[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingLoan, setEditingLoan] = React.useState<Loan | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const lpkNames = React.useMemo(() => [...new Set(proposals.map(p => p.lpkName))], []);

  // Initialize loans state from approved proposals
  React.useEffect(() => {
    const approvedLoans = proposals.filter(p => p.status === 'Approved');
    const loanDetails = approvedLoans.flatMap(loan => 
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
        };
      })
    );
    setLoans(loanDetails);
  }, []);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      lpkName: "",
      studentId: "",
      amount: "",
      installmentDueDate: 1,
    }
  });

  React.useEffect(() => {
    if (editingLoan) {
      form.reset({
        studentId: editingLoan.student?.id,
        lpkName: editingLoan.lpkName,
        amount: editingLoan.amount,
        installmentDueDate: editingLoan.installmentDueDate,
      });
    } else {
      form.reset({
        lpkName: "",
        studentId: "",
        amount: "",
        installmentDueDate: 1,
      });
    }
  }, [editingLoan, form]);

  const handleAddOrEditLoan = async (data: LoanFormValues) => {
    setIsGenerating(true);
    const student = students.find(s => s.id === data.studentId);
    if (!student) {
        toast({ variant: 'destructive', title: 'Error', description: 'Selected student not found.' });
        setIsGenerating(false);
        return;
    }

    const amountNum = parseFloat(data.amount.replace(/[^0-9.-]+/g, ""));
    const principal = `Rp ${(amountNum * 0.9).toLocaleString('id-ID')}`;
    const margin = `Rp ${(amountNum * 0.1).toLocaleString('id-ID')}`;
    const estimatedInstallment = `Rp ${(amountNum / 12).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;
    
    try {
        if (editingLoan) {
            // Edit existing loan
            setLoans(prevLoans => prevLoans.map(l => l.id === editingLoan.id ? {
                ...l,
                student,
                lpkName: data.lpkName,
                amount: data.amount,
                principal,
                margin,
                estimatedInstallment,
                installmentDueDate: data.installmentDueDate,
            } : l));
            toast({ title: 'Loan Updated', description: `Loan for ${student.name} has been updated.` });
        } else {
            // Add new loan and generate VA
            const loanId = `loan-${Date.now()}`;
            const bank = 'Mandiri';
            const { virtualAccountNumber } = await generateVirtualAccount({ 
                studentName: student.name, 
                loanId, 
                bank
            });

            const newLoan: Loan = {
                id: loanId,
                student,
                lpkName: data.lpkName,
                amount: data.amount,
                principal,
                margin,
                estimatedInstallment,
                submittedDate: new Date().toISOString(),
                installmentDueDate: data.installmentDueDate,
                virtualAccountNumber,
                bank,
                status: 'Active',
            };
            setLoans(prevLoans => [newLoan, ...prevLoans]);
            toast({ title: 'Loan Added', description: `A new loan has been created for ${student.name}.` });
        }
    } catch (error) {
        console.error("Error processing loan:", error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not generate a virtual account.' });
    } finally {
        setIsGenerating(false);
        setIsModalOpen(false);
        setEditingLoan(null);
    }
  };

  const handleRegenerateVA = async (loan: Loan) => {
    if (!loan.student) return;
    toast({ title: 'Generating...', description: 'A new virtual account is being generated.'});
    try {
        const bank = 'BCA';
        const { virtualAccountNumber } = await generateVirtualAccount({ 
            studentName: loan.student.name, 
            loanId: loan.id, 
            bank
        });
        setLoans(prevLoans => prevLoans.map(l => l.id === loan.id ? { ...l, virtualAccountNumber, bank } : l));
        toast({ title: 'VA Regenerated!', description: `New VA for ${loan.student.name} is ready.` });
    } catch (error) {
        console.error("Error regenerating VA:", error);
        toast({ variant: 'destructive', title: 'Generation Failed', description: 'Could not regenerate the virtual account.' });
    }
  }
  
  const handleCopyVA = (va: string | null) => {
    if (va) {
      navigator.clipboard.writeText(va);
      toast({ title: 'Copied!', description: 'Virtual account number copied to clipboard.'});
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-4xl font-headline font-bold text-primary">Loan Management</h1>
            <p className="mt-2 text-muted-foreground">View, add, and manage all active loans.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
            setIsModalOpen(isOpen);
            if (!isOpen) setEditingLoan(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingLoan(null); form.reset(); setIsModalOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent>
             <DialogHeader>
              <DialogTitle>{editingLoan ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
              <DialogDescription>
                {editingLoan ? 'Update the details for this loan.' : 'Fill in the details to create a new loan and generate a virtual account.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddOrEditLoan)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="lpkName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>LPK Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingLoan}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an LPK" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {lpkNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingLoan}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.email}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Loan Amount</FormLabel>
                                <FormControl><Input placeholder="e.g., Rp 25.000.000" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="installmentDueDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Installment Due Date (Day of Month)</FormLabel>
                                <FormControl><Input type="number" min="1" max="28" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingLoan(null); }}>Cancel</Button>
                        <Button type="submit" disabled={isGenerating}>
                            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingLoan ? 'Save Changes' : 'Create & Generate VA'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Active Loans</CardTitle>
          <CardDescription>A list of all approved financing proposals, detailed by student.</CardDescription>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Virtual Account</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.length > 0 ? (
                  loans.map((detail) => (
                    <TableRow key={detail.id}>
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
                        ) : "Student not found"}
                      </TableCell>
                      <TableCell>{detail.lpkName}</TableCell>
                      <TableCell>{detail.amount}</TableCell>
                      <TableCell>{format(new Date(detail.submittedDate), "PPP")}</TableCell>
                      <TableCell>{getDayWithSuffix(detail.installmentDueDate)} of each month</TableCell>
                       <TableCell>
                        <Badge variant={statusVariant[detail.status]}>{detail.status}</Badge>
                      </TableCell>
                       <TableCell>
                          {detail.virtualAccountNumber ? (
                             <div className="flex items-center gap-2">
                                <div>
                                    <span className="font-mono text-sm">{detail.virtualAccountNumber}</span>
                                    <div className="text-xs text-muted-foreground">{detail.bank}</div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopyVA(detail.virtualAccountNumber)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                             </div>
                          ) : 'Not generated'}
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/finance/loans/${detail.id}`}>Manage Loan</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setEditingLoan(detail); setIsModalOpen(true); }}>Edit Loan</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRegenerateVA(detail)}>Regenerate VA</DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
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
