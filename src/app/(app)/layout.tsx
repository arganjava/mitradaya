"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutGrid, User, Settings, Landmark, GraduationCap, BookOpen, Briefcase, LogOut } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import { cn } from "@/lib/utils";

function MobileBottomNav({ isLpk }: { isLpk: boolean }) {
  const pathname = usePathname();
  const menuItems = isLpk ? [
    { href: "/lpk", label: "Finance", icon: <Landmark /> },
    { href: "/lpk/students", label: "Students", icon: <GraduationCap /> },
    { href: "/lpk/programs", label: "Programs", icon: <BookOpen /> },
    { href: "/lpk/jobs", label: "Jobs", icon: <Briefcase /> },
    { href: "/lpk/settings", label: "Personalize", icon: <Settings /> },
  ] : [
    { href: "/finance", label: "Dashboard", icon: <LayoutGrid /> },
    { href: "/finance/profile", label: "My Profile", icon: <User /> },
    { href: "/finance/settings", label: "Personalize", icon: <Settings /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {menuItems.map((item) => (
           <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-2 hover:bg-muted group",
               (pathname === item.href || (item.href !== '/lpk' && item.href !== '/finance' && pathname.startsWith(item.href))) ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {React.cloneElement(item.icon, { className: "w-5 h-5 mb-1"})}
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}


// This new component is a child of SidebarProvider, so it can use the useSidebar hook.
function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLpk = pathname.startsWith('/lpk');
  const { state: sidebarState, isMobile } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  return (
    <>
      <Sidebar className="hidden md:flex">
        <SidebarHeader>
          <Logo isCollapsed={isMobile ? false : isCollapsed} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/lpk" : "/finance"} isActive={pathname === (isLpk ? '/lpk' : '/finance')} tooltip={isLpk ? "Finance" : "Dashboard"}>
                {isLpk ? <Landmark /> : <LayoutGrid />}
                <span>{isLpk ? "Finance" : "Dashboard"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {isLpk ? (
              <>
               <SidebarMenuItem>
                <SidebarMenuButton href="/lpk/students" isActive={pathname.startsWith('/lpk/students')} tooltip="Students">
                  <GraduationCap />
                  <span>Students</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/lpk/programs" isActive={pathname.startsWith('/lpk/programs')} tooltip="Programs">
                  <BookOpen />
                  <span>Programs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton href="/lpk/jobs" isActive={pathname.startsWith('/lpk/jobs')} tooltip="Jobs">
                  <Briefcase />
                  <span>Jobs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              </>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton href="/finance/profile" isActive={pathname.startsWith('/finance/profile')} tooltip="My Profile">
                  <User />
                  <span>My Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/lpk/settings" : "/finance/settings"} isActive={pathname.includes('/settings')} tooltip="Personalize">
                <Settings />
                <span>Personalize</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

        </SidebarContent>
        <SidebarFooter>
          <Separator className="mb-2" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors text-left outline-none ring-sidebar-ring focus-visible:ring-2">
                <Avatar>
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className={`transition-opacity duration-200 ${isCollapsed && !isMobile ? 'opacity-0' : 'opacity-100'}`}>
                  <p className="font-semibold text-sm">User Name</p>
                  <p className="text-xs text-sidebar-foreground/70">user@example.com</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[calc(var(--sidebar-width)_-_1rem)] mb-2 ml-2 bg-sidebar border-sidebar-border text-sidebar-foreground">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sidebar-border" />
               <DropdownMenuItem asChild>
                <Link href={isLpk ? "/lpk/settings" : "/finance/settings"} className="cursor-pointer w-full flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Personalize</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" asChild>
                <Link href="/" className="cursor-pointer w-full flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
           <Logo />
        </header>
        <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen pb-20 md:pb-8">
          {children}
        </div>
      </SidebarInset>
      <MobileBottomNav isLpk={isLpk} />
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutClient>{children}</AppLayoutClient>
    </SidebarProvider>
  );
}
