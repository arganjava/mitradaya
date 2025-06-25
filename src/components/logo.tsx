import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  isCollapsed?: boolean;
}

export function Logo({ className, isCollapsed = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Building2 className="h-6 w-6 text-primary" />
      {!isCollapsed && (
        <span className="font-headline text-lg font-bold">Mitradaya</span>
      )}
    </Link>
  );
}
