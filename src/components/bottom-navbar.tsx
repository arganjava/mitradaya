
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, GraduationCap, BookOpen, Users, Settings, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

type NavLinkProps = NavItem & {
  isActive: boolean;
};

function NavLink({ href, icon: Icon, label, isActive }: NavLinkProps) {
  return (
    <Link href={href} className={cn(
      "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
      isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'
    )}>
      <Icon className="h-5 w-5" />
      <span className="text-xs tracking-tight">{label}</span>
    </Link>
  );
}

export function BottomNavbar() {
  const pathname = usePathname();
  const isLpk = pathname.startsWith('/lpk');

  const lpkNavItems: NavItem[] = [
    { href: "/lpk", icon: LayoutGrid, label: "Providers" },
    { href: "/lpk/students", icon: GraduationCap, label: "Students" },
    { href: "/lpk/programs", icon: BookOpen, label: "Programs" },
    { href: "/lpk/jobs", icon: Briefcase, label: "Jobs" },
    { href: "/lpk/users", icon: Users, label: "Users" },
    { href: "/lpk/settings", icon: Settings, label: "Settings" },
  ];

  const financeNavItems: NavItem[] = [
    { href: "/finance", icon: LayoutGrid, label: "Dashboard" },
    { href: "/finance/profile", icon: User, label: "Profile" },
    { href: "/finance/settings", icon: Settings, label: "Settings" },
  ];
    
  const navItems = isLpk ? lpkNavItems : financeNavItems;

  const activeItem = React.useMemo(() => {
    let active: NavItem | null = null;
    // Find the most specific match
    for (const item of navItems) {
      if (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/lpk' && item.href !== '/finance')) {
        if (!active || item.href.length > active.href.length) {
          active = item;
        }
      }
    }
     // Fallback for root dashboard pages
    if (!active) {
        if (isLpk && pathname === '/lpk') active = lpkNavItems[0];
        if (!isLpk && pathname === '/finance') active = financeNavItems[0];
    }
    return active;
  }, [pathname, navItems, isLpk, lpkNavItems, financeNavItems]);


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-border md:hidden">
      <div className={cn("grid h-full w-full", isLpk ? 'grid-cols-6' : 'grid-cols-3')}>
        {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={item.href === activeItem?.href}
            />
          )
        )}
      </div>
    </nav>
  );
}
