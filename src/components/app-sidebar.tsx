"use client";

import * as React from "react";
import Link from "next/link";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import {
  HomeIcon,
  ListIcon,
  NewspaperIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

function SidebarLogo() {
  return (
    <Link className="group/logo inline-flex" href="/">
      <span className="sr-only">Logo</span>
      <Image src="/zeus.png" alt="Zeus Logo" width={64} height={64} />
    </Link>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();

  const pathname = usePathname();

  const data = {
    user: {
      name: session?.user?.name,
      email: session?.user?.email,
    },
    navMain: [
      {
        title: "Zeus",
        items: [
          {
            title: "Dashboard",
            url: "/",
            icon: HomeIcon,
            isActive: pathname === "/",
          },
          {
            title: "Notices",
            url: "/notices",
            icon: ListIcon,
            isActive: pathname === "/notices",
          },
          {
            title: "Users",
            url: "/users",
            icon: UsersIcon,
            isActive: pathname === "/users",
          },
          {
            title: "Publications",
            url: "/publications",
            icon: NewspaperIcon,
            isActive: pathname === "/publications",
          },
          {
            title: "Interchange",
            url: "/interchange",
            icon: WorkflowIcon,
            isActive: pathname === "/interchange",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/65">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button group-data-[collapsible=icon]:px-[5px]! font-medium gap-3 h-9 [&>svg]:size-auto"
                      tooltip={item.title}
                      isActive={item.isActive}
                    >
                      <Link href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary-foreground"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
