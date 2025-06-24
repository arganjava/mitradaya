"use client";

import * as React from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { students, financialProviders } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const financingApplicationSchema = z.object({
  studentIds: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one student.",
  }),
  amount: z.string().min(1, { message: "Please enter the total financing amount." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).optional().or(z.literal('')),
});

type FinancingApplicationValues = z.infer<typeof financingApplicationSchema>;

export default function ApplyFinancingPage() {
  const router = useRouter();
  const params = useParams() as { id: string };
  const { toast } = useToast();

  const provider = React.useMemo(
    () => financialProviders.find((p) => p.id === params.id),
    [params.id]
  );
  
  const form = useForm<FinancingApplicationValues>({
    resolver: zodResolver(financingApplicationSchema),
    defaultValues: {
      studentIds: [],
      amount: "",
      message: "",
    },
  });

  if (!provider) {
    return notFound();
  }

  function onSubmit(data: FinancingApplicationValues) {
    console.log(data);
    toast({
      title: "Financing Application Sent!",
      description: `Your application to ${provider?.name} has been submitted successfully.`,
    });
    router.push(`/lpk/providers/${provider.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Link href={`/lpk/providers/${provider.id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Provider Profile
        </Link>
        
        <header>
          <h1 className="text-4xl font-headline font-bold text-primary">Apply for Financing</h1>
          <p className="text-muted-foreground mt-2">
            Submit an application for your students to <span className="font-semibold text-foreground">{provider.name}</span>.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>1. Select Students</CardTitle>
            <CardDescription>Choose the students who require financing for their program.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="studentIds"
              render={() => (
                <FormItem>
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card">
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Program</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <FormField
                            key={student.id}
                            control={form.control}
                            name="studentIds"
                            render={({ field }) => (
                              <TableRow>
                                <TableCell>
                                  <Checkbox
                                    checked={field.value?.includes(student.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), student.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== student.id
                                            )
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
                            )}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                   <FormMessage className="mt-2" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>2. Financing Details</CardTitle>
                <CardDescription>Specify the total amount needed and any additional message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Amount Required</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Rp 50.000.000" {...field} />
                        </FormControl>
                        <FormDescription>
                            Enter the total financing amount for all selected students.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Additional Message (Optional)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Include any extra details for the provider..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">Submit Application</Button>
        </div>
      </form>
    </Form>
  );
}
