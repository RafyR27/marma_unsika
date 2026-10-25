"use client";

import { useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../common/SideBar/app-sidebar";
import LogoutDialog from "@/components/common/LogoutDialog";
import { IAuthUser, SessionUser } from "@/types/user";

export default function SidebarLayout({
  children,
  user
}: {
  children: React.ReactNode;
  user?: IAuthUser | SessionUser;
}) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} onLogout={() => setLogoutOpen(true)} />
      <SidebarInset>{children}</SidebarInset>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </SidebarProvider>
  );
}
