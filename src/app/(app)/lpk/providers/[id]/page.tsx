import { financialProviders } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AtSign, Globe } from "lucide-react";
import Link from "next/link";

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
  const provider = financialProviders.find(p => p.id === params.id);

  if (!provider) {
    notFound();
  }

  return (
    <div className="space-y-8">
       <Link href="/lpk" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Providers List
        </Link>
        
      <header className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Image
            src={provider.logo}
            alt={`${provider.name} logo`}
            width={128}
            height={128}
            className="rounded-lg border p-1"
            data-ai-hint={provider.dataAiHint}
        />
        <div className="flex-grow">
            <h1 className="text-4xl font-headline font-bold text-primary">{provider.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
                {provider.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
            <p className="text-muted-foreground mt-3 max-w-prose">{provider.description}</p>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
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
                        <AtSign className="w-5 h-5 text-primary" />
                        <a href={`mailto:${provider.contact.email}`} className="text-sm hover:underline">{provider.contact.email}</a>
                    </div>
                     <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <a href={provider.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">{provider.contact.website}</a>
                    </div>
                </CardContent>
            </Card>
            <Button className="w-full">Apply for Partnership</Button>
        </div>
      </div>
    </div>
  );
}
