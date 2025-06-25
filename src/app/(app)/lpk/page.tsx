
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import { financialProviders, proposals } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

const statusVariant: {
  [key: string]: "default" | "secondary" | "destructive" | "outline";
} = {
  Approved: "default",
  Pending: "secondary",
  Rejected: "destructive",
};

export default function LpkDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your financing proposals and discover new partners.
        </p>
      </header>

      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals">My Proposals</TabsTrigger>
          <TabsTrigger value="find-providers">Find Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Financing Proposals</CardTitle>
              <CardDescription>
                Track the status of all your submitted financing applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Image
                            src={"https://placehold.co/100x100.png"}
                            alt={`${proposal.financeProviderName} logo`}
                            width={32}
                            height={32}
                            className="rounded-full border"
                            data-ai-hint="finance logo"
                          />
                          <span>{proposal.financeProviderName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{proposal.amount}</TableCell>
                      <TableCell className="text-center">
                        {proposal.studentCount}
                      </TableCell>
                      <TableCell>
                        {format(new Date(proposal.submittedDate), "PPP")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant[proposal.status] || "default"}
                        >
                          {proposal.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            <CardHeader className="p-0">
              <CardTitle>Financing Proposals</CardTitle>
              <CardDescription>
                Track the status of all your submitted financing applications.
              </CardDescription>
            </CardHeader>
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={"https://placehold.co/100x100.png"}
                        alt={`${proposal.financeProviderName} logo`}
                        width={40}
                        height={40}
                        className="rounded-full border"
                        data-ai-hint="finance logo"
                      />
                      <div>
                        <CardTitle className="text-lg leading-snug">
                          {proposal.financeProviderName}
                        </CardTitle>
                        <CardDescription>
                          {format(new Date(proposal.submittedDate), "PPP")}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={statusVariant[proposal.status] || "default"}
                    >
                      {proposal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="-mx-6 mb-4 w-auto" />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">{proposal.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium">
                        {proposal.studentCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="find-providers" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by provider name or keyword..."
                    className="pl-10"
                  />
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {financialProviders.map((provider) => (
              <Card
                key={provider.id}
                className="flex flex-col-reverse transition-shadow hover:shadow-lg sm:flex-col"
              >
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
                    <CardTitle className="font-headline text-xl">
                      {provider.name}
                    </CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {provider.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    {provider.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/lpk/providers/${provider.id}`}
                    className="w-full"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      View Profile
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
