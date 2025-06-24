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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutGrid, User, Settings, Landmark, Users, GraduationCap, BookOpen, Briefcase, LogOut } from "lucide-react";
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

// This new component is a child of SidebarProvider, so it can use the useSidebar hook.
function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLpk = pathname.startsWith('/lpk');
  const { state: sidebarState, isMobile } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  return (
    <>
      <Sidebar>
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
              <SidebarMenuItem>
                <SidebarMenuButton href="/lpk/users" isActive={pathname.startsWith('/lpk/users')} tooltip="Users">
                  <Users />
                  <span>Users</span>
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
          <SidebarTrigger />
          <Logo />
        </header>
        <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
          {children}
        </div>
      </SidebarInset>
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
