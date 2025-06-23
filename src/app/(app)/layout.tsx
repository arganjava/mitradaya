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
import { LayoutGrid, User, Settings, LifeBuoy, LogOut, School, Landmark } from "lucide-react";
import { usePathname } from 'next/navigation';
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLpk = pathname.startsWith('/lpk');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo isCollapsed={useSidebar().state === 'collapsed'} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/lpk" : "/finance"} isActive={pathname === (isLpk ? '/lpk' : '/finance')} tooltip={isLpk ? "Find Providers" : "Dashboard"}>
                <LayoutGrid />
                <span>{isLpk ? "Find Providers" : "Dashboard"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/lpk/profile" : "/finance/profile"} isActive={pathname.includes('/profile')} tooltip="My Profile">
                <User />
                <span>My Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/lpk/settings" : "/finance/settings"} isActive={pathname.includes('/settings')} tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <Separator className="my-4" />

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href={isLpk ? "/finance" : "/lpk"} tooltip={isLpk ? "Switch to Finance" : "Switch to LPK"}>
                {isLpk ? <Landmark /> : <School />}
                <span>Switch Role</span>
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
            <div className={`transition-opacity duration-200 ${useSidebar().state === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
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
    </SidebarProvider>
  );
}
