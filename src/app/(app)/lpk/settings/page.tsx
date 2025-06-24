
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from 'next/link';
import { LogOut } from 'lucide-react';

export default function LpkSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-headline font-bold text-primary">
          Personalize
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your LPK profile, account, and preferences.
        </p>
      </header>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Company</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="bank-account">Bank Account</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LPK Profile</CardTitle>
              <CardDescription>
                Update your organization's public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <Image
                  src="https://placehold.co/128x128.png"
                  alt="LPK Logo"
                  width={128}
                  height={128}
                  className="rounded-lg border p-1"
                  data-ai-hint="training logo"
                />
                <div className="flex-grow">
                  <Label htmlFor="logo">LPK Logo</Label>
                  <Input id="logo" type="file" className="mt-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Recommended size: 256x256px
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lpkName">LPK Name</Label>
                <Input id="lpkName" defaultValue="LPK Jaya Abadi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lpkDescription">Description</Label>
                <Textarea
                  id="lpkDescription"
                  placeholder="Tell us about your LPK"
                  defaultValue="Providing top-tier vocational training in technology and digital arts since 2010."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lpkAddress">Address</Label>
                <Textarea
                  id="lpkAddress"
                  placeholder="Your full address"
                  defaultValue="Jl. Teknologi No. 1, Technopark, Jakarta, Indonesia"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lpkEmail">Contact Email</Label>
                  <Input
                    id="lpkEmail"
                    type="email"
                    defaultValue="info@lpkjaya.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lpkPhone">Phone Number</Label>
                  <Input
                    id="lpkPhone"
                    type="tel"
                    defaultValue="+62 21 1234 5678"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>
                Upload and manage your LPK's legal documents and certifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="akta">Akta Pendirian Lembaga</Label>
                <Input id="akta" type="file" />
                <p className="text-xs text-muted-foreground">
                  Upload a scan of your deed of establishment.
                </p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="npwp">NPWP</Label>
                <Input id="npwp" type="file" />
                 <p className="text-xs text-muted-foreground">
                  Upload your Taxpayer Identification Number card.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="izinOperasional">Izin Operasional LPK (Disnaker)</Label>
                <Input id="izinOperasional" type="file" />
                <p className="text-xs text-muted-foreground">
                  Upload your official operational permit from the Ministry of Manpower.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kerjasamaSo">Surat Kerja Sama dengan SO (jika ada)</Label>
                <Input id="kerjasamaSo" type="file" />
                <p className="text-xs text-muted-foreground">
                  Upload your cooperation agreement with an SO, if applicable.
                </p>
              </div>
               <div className="space-y-2">
                <Label htmlFor="kurikulum">Modul/Kurikulum Pelatihan</Label>
                <Input id="kurikulum" type="file" />
                 <p className="text-xs text-muted-foreground">
                  Upload your training curriculum document.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sertifikasiInstruktur">Bukti Sertifikasi Instruktur</Label>
                <Input id="sertifikasiInstruktur" type="file" />
                 <p className="text-xs text-muted-foreground">
                  Upload proof of your instructor's certification(s).
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Documents</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bank-account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Account</CardTitle>
              <CardDescription>
                Manage your LPK's bank account for transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="e.g., Bank Central Asia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input id="accountHolder" placeholder="e.g., PT LPK Jaya Abadi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="e.g., 1234567890" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Bank Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@lpkjaya.com"
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
