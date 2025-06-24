
"use client";

import * as React from "react";
import { financialProviders } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AtSign, Globe } from "lucide-react";
import Link from "next/link";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


const partnershipFormSchema = z.object({
  message: z.string().min(20, {
    message: "Your message must be at least 20 characters long.",
  }),
});

type PartnershipFormValues = z.infer<typeof partnershipFormSchema>;

export default function ProviderDetailPage() {
  const params = useParams() as { id: string };
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const provider = React.useMemo(
    () => financialProviders.find((p) => p.id === params.id),
    [params.id]
  );
  
  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: {
      message: `Dear ${provider?.name},\n\nWe are interested in partnering with you to provide financing for our students. Please let us know the next steps.\n\nBest regards,\nLPK Jaya Abadi`,
    },
  });

  if (!provider) {
    notFound();
  }

  function onSubmit(data: PartnershipFormValues) {
    console.log(data);
    toast({
      title: "Application Submitted!",
      description: `Your partnership request to ${provider?.name} has been sent.`,
    });
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-6 md:space-y-8">
       <Link href="/lpk" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Providers List
        </Link>
        
      <header className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6">
        <Image
            src={provider.logo}
            alt={`${provider.name} logo`}
            width={128}
            height={128}
            className="rounded-lg border p-1 w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
            data-ai-hint={provider.dataAiHint}
        />
        <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{provider.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                {provider.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
            <p className="text-muted-foreground mt-3 max-w-prose">{provider.description}</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Financing Scheme Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{provider.financingSchemes}</p>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <AtSign className="w-5 h-5 text-primary flex-shrink-0" />
                        <a href={`mailto:${provider.contact.email}`} className="text-sm hover:underline break-all">{provider.contact.email}</a>
                    </div>
                     <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                        <a href={provider.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline break-all">{provider.contact.website}</a>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Apply for Partnership</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Apply for Partnership with {provider.name}</DialogTitle>
                  <DialogDescription>
                    Send a message to start the partnership process. They will contact you via email.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Explain why you'd like to partner with them..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This message will be sent to their contact email.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Send Application</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
      </div>
    </div>
  );
}

