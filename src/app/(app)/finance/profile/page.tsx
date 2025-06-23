"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const profileFormSchema = z.object({
  providerName: z.string().min(2, "Provider name must be at least 2 characters."),
  contactEmail: z.string().email("Please enter a valid email address."),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  description: z.string().max(300, "Description cannot exceed 300 characters.").min(10, "Description must be at least 10 characters."),
  financingSchemes: z.string().min(10, "Please describe your financing schemes."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  providerName: "DanaCepat Finance",
  contactEmail: "contact@danacepat.com",
  website: "https://www.danacepat.com",
  description: "Quick and easy financing for certified training programs with competitive rates.",
  financingSchemes: "We offer personal loans and education credit with flexible repayment terms. Our focus is on supporting students in vocational and tech training programs.",
};

export default function FinanceProfilePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved successfully.",
    });
    console.log(data);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">Manage Your Profile</h1>
        <p className="text-muted-foreground mt-2">Keep your information up-to-date for LPKs to find you.</p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
               <Image src="https://placehold.co/128x128.png" alt="Provider Logo" width={128} height={128} className="rounded-lg border p-1" data-ai-hint="finance logo" />
               <Button variant="outline" size="sm" className="w-full mt-2">Change Logo</Button>
            </div>
            <div className="flex-grow">
              <CardTitle className="font-headline text-2xl">Provider Information</CardTitle>
              <CardDescription>This is how your profile will appear to LPKs.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="providerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., DanaCepat Finance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., contact@provider.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-website.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief introduction to your company."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A short, catchy description that appears in search results.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="financingSchemes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financing Schemes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the financing options you provide..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Detail the types of loans, interest rates, requirements, and benefits.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
