"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import Link from 'next/link';
import { LogOut } from 'lucide-react';

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

export default function FinanceSettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("profile");

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
        <h1 className="text-4xl font-headline font-bold text-primary">Personalize</h1>
        <p className="mt-2 text-muted-foreground">Manage your profile, account, and preferences.</p>
      </header>

      <Tabs defaultValue="profile" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="financing">Financing Package</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="profile" className="mt-0">
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
                <CardContent className="space-y-8">
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
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financing" className="mt-0">
               <Card>
                <CardHeader>
                    <CardTitle>Financing Package</CardTitle>
                    <CardDescription>Describe the financing options you provide for LPK students.</CardDescription>
                </CardHeader>
                <CardContent>
                     <FormField
                        control={form.control}
                        name="financingSchemes"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Financing Schemes</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Describe the financing options you provide..."
                                className="min-h-[200px]"
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
                </CardContent>
               </Card>
            </TabsContent>

            {activeTab !== 'account' && (
                <div className="flex justify-end">
                    <Button type="submit">Save Changes</Button>
                </div>
            )}
          </form>
        </Form>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="contact@danacepat.com"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Confirm New Password</Label>
                <Input id="passwordConfirm" type="password" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
              <Button>Update Password</Button>
              <Button variant="destructive" asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
