import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Users, DollarSign, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format } from "date-fns";
import { proposals } from "@/lib/data";
import Link from 'next/link';

const statusVariant: {
  [key: string]: "default" | "secondary" | "destructive" | "outline";
} = {
  Approved: "default",
  Pending: "secondary",
  Rejected: "destructive",
};

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">
          Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's a summary of your activities.
        </p>
      </header>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Funding Disbursed
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 1.2B</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Partnerships
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+25 LPKs</div>
                <p className="text-xs text-muted-foreground">
                  +5 since last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Applications
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">
                  in the last 7 days
                </p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Partnership Requests</CardTitle>
              <CardDescription>
                Review and respond to new partnership requests from LPKs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Partnership request features will be available in a future
                update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="proposals" className="space-y-4">
          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardHeader>
              <CardTitle>Financing Proposals</CardTitle>
              <CardDescription>
                Review and manage financing applications from LPKs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>LPK</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Image
                            src={proposal.lpkLogo}
                            alt={`${proposal.lpkName} logo`}
                            width={32}
                            height={32}
                            className="rounded-full border"
                            data-ai-hint="training logo"
                          />
                          <span>{proposal.lpkName}</span>
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`/finance/proposals/${proposal.id}`}>View Proposal</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                Review and manage financing applications from LPKs.
              </CardDescription>
            </CardHeader>
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={proposal.lpkLogo}
                        alt={`${proposal.lpkName} logo`}
                        width={40}
                        height={40}
                        className="rounded-full border"
                        data-ai-hint="training logo"
                      />
                      <div>
                        <CardTitle className="text-lg leading-snug">
                          {proposal.lpkName}
                        </CardTitle>
                        <CardDescription>
                          {format(new Date(proposal.submittedDate), "PPP")}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={statusVariant[proposal.status] || "default"}
                      className="flex-shrink-0"
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
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/finance/proposals/${proposal.id}`}>Details</Link>
                    </Button>
                  {proposal.status === "Pending" && (
                    <Button size="sm">Review</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
