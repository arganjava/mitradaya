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
import { LayoutGrid, User, Settings, School, Landmark, Users, GraduationCap, BookOpen } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNavbar } from "@/components/bottom-navbar";

// This new component is a child of SidebarProvider, so it can use the useSidebar hook.
function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLpk = pathname.startsWith('/lpk');
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <div className="p-4 sm:p-6 pb-20 bg-background min-h-screen">
          {children}
        </div>
        <BottomNavbar />
      </>
    );
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Logo isCollapsed={isCollapsed} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/lpk" : "/finance"} isActive={pathname === (isLpk ? '/lpk' : '/finance')} tooltip={isLpk ? "Find Providers" : "Dashboard"}>
                <LayoutGrid />
                <span>{isLpk ? "Find Providers" : "Dashboard"}</span>
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
              <SidebarMenuButton href={isLpk ? "/lpk/settings" : "/finance/settings"} isActive={pathname.includes('/settings')} tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

        </SidebarContent>
        <SidebarFooter>
          <Separator className="mb-2" />
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <p className="font-semibold text-sm">User Name</p>
              <p className="text-xs text-sidebar-foreground/70">user@example.com</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
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
