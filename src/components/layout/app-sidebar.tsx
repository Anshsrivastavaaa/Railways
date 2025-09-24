'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { TrainFront, LayoutDashboard, BotMessageSquare, Route, ShieldAlert, ScrollText, LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/scenarios', label: 'What-If Scenarios', icon: BotMessageSquare },
    { href: '/dashboard/trains', label: 'Live Trains', icon: Route },
    { href: '/dashboard/disruptions', label: 'Disruptions', icon: ShieldAlert },
    { href: '/dashboard/audit', label: 'Audit Trail', icon: ScrollText },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <TrainFront className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-headline font-semibold tracking-tight text-sidebar-foreground">
              RailFlow
            </h2>
            <p className="text-xs text-muted-foreground">Optimizer</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2 space-y-2">
        <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/settings">
                <SidebarMenuButton tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/">
                    <SidebarMenuButton tooltip="Logout">
                        <LogOut/>
                        <span>Logout</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent">
            <Avatar className="h-10 w-10">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />}
                <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <p className="text-sm font-medium text-sidebar-foreground">Controller A</p>
                <p className="text-xs text-muted-foreground">NDLS Division</p>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
