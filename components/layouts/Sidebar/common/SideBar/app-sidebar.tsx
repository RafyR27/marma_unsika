"use client";

import * as React from "react";

import { usePathname } from "next/navigation";
import { NavDocuments } from "./NavSection/nav-documents";
import { NavMain } from "./NavSection/nav-main";
import { NavTools } from "./NavSection/nav-tools";
import { NavUser } from "./NavSection/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_ADMIN } from "./sidebarAdmin.constants";
import { SIDEBAR_SELLER } from "./sidebarSeller.constant";
import { SIDEBAR_COURIER } from "./sidebarCourier.constant";
import { IAuthUser, SessionUser } from "@/types/user";
import { useMe } from "@/hooks/useMe";

export function AppSidebar({
  user,
  onLogout,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user?: IAuthUser | SessionUser;
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const { data: meUser } = useMe();
  const currentUser = user ?? meUser ?? undefined;

  const isSeller =
    pathname.startsWith("/seller") || currentUser?.role === "seller";
  const isCourier =
    pathname.startsWith("/courier") || currentUser?.role === "courier";

  const DATA = isSeller
    ? SIDEBAR_SELLER
    : isCourier
    ? SIDEBAR_COURIER
    : SIDEBAR_ADMIN;

  const dashboardHref = isSeller
    ? "/seller/dashboard"
    : isCourier
    ? "/courier/dashboard"
    : "/admin/dashboard";

  const brandTitle = isSeller
    ? (currentUser as IAuthUser)?.profile?.store_name || "Marma Penjual"
    : isCourier
    ? "Marma Kurir"
    : "Marma Super Admin";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! space-x-2"
              render={<a href={dashboardHref} />}
            >
              <span className="text-base font-bold text-primary">
                {brandTitle}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={DATA?.navMain} />
        <NavDocuments items={DATA?.documents} />
        <NavTools items={DATA?.tools} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} onLogout={onLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}
