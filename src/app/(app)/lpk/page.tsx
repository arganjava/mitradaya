import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import { financialProviders } from "@/lib/data";

export default function LpkDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">Find Financial Providers</h1>
        <p className="text-muted-foreground mt-2">Discover financing partners for your training programs.</p>
      </header>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search by provider name or keyword..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by financing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Loans</SelectItem>
                <SelectItem value="micro">Micro Loans</SelectItem>
                <SelectItem value="syariah">Syariah Compliant</SelectItem>
                <SelectItem value="sme">SME Support</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jakarta">Jakarta</SelectItem>
                <SelectItem value="surabaya">Surabaya</SelectItem>
                <SelectItem value="bandung">Bandung</SelectItem>
                <SelectItem value="all">All Locations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {financialProviders.map((provider) => (
          <Card key={provider.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader className="flex-row items-center gap-4">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                width={64}
                height={64}
                className="rounded-lg border"
                data-ai-hint={provider.dataAiHint}
              />
              <div>
                <CardTitle className="font-headline text-xl">{provider.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {provider.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">{provider.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/lpk/providers/${provider.id}`} className="w-full">
                <Button className="w-full bg-primary hover:bg-primary/90">View Profile</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
