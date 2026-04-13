'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map, Hotel, Search } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/', label: 'Мои Маршруты', icon: Map },
  { href: '/tours', label: 'Поиск Туров', icon: Search },
  { href: '/housing', label: 'Аренда Жилья', icon: Hotel },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Compass className="text-primary h-8 w-8 shrink-0" />
          <h1 className="text-2xl font-headline font-bold text-primary group-data-[collapsible=icon]:hidden">
            Путевой Компас
          </h1>
        </div>
      </SidebarHeader>

      <SidebarMenu className="flex-1 p-4 pt-0">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{children: item.label}}
            >
              <Link href={item.href}>
                <item.icon />
                <span className="truncate">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter className="p-4 hidden md:flex">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
