import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Landmark, School } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <div className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-primary">
          Welcome to SkillBridge
        </h1>
        <p className="mt-4 text-base sm:text-lg text-foreground/80 max-w-2xl">
          Connecting Job Training Providers (LPK) with Financial Services. Choose your role to get started and unlock new opportunities.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <Link href="/lpk">
            <Card className="text-left h-full flex flex-col hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <School className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">LPK</CardTitle>
                    <CardDescription>Lembaga Pelatihan Kerja</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full">
                  Enter as LPK <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
          <Link href="/finance">
            <Card className="text-left h-full flex flex-col hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Landmark className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-2xl">Finance</CardTitle>
                    <CardDescription>Penyedia Jasa Keuangan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full">
                  Enter as Finance Provider <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
