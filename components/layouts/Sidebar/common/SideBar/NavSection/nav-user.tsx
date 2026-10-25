"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IAuthUser, SessionUser } from "@/types/user";
import {
  EllipsisVerticalIcon,
  LogOutIcon,
  UserRound,
} from "lucide-react";
import Link from "next/link";

export function NavUser({
  user,
  onLogout,
}: {
  user?: IAuthUser | SessionUser;
  onLogout?: () => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLogoutClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    onLogout?.();
  };

  const displayName = user?.name || "Pengguna";
  const displaySubtitle =
    user?.email ||
    ("phone" in (user || {}) ? (user as IAuthUser).phone : "") ||
    "Akun Marma";
  const userRole = user?.role || "";
  const storeName =
    "profile" in (user || {}) ? (user as IAuthUser).profile?.store_name : null;
  const avatarImage =
    user?.image ||
    ("avatar" in (user || {}) ? (user as IAuthUser).avatar : null) ||
    "https://res.cloudinary.com/dejhqj1te/image/upload/v1787872501/Frame_3_ytpno7.png";

  const profileHref =
    userRole === "admin"
      ? "/admin/profile"
      : userRole === "seller"
      ? "/seller/profile"
      : userRole === "courier"
      ? "/courier/profile"
      : "/profile";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-full grayscale">
              <AvatarImage src={avatarImage} alt={displayName} />
              <AvatarFallback className="rounded-full">
                {displayName ? displayName.substring(0, 2).toUpperCase() : "US"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{displayName}</span>
              <span className="truncate text-xs text-foreground/70">
                {displaySubtitle}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={avatarImage} alt={displayName} />
                    <AvatarFallback className="rounded-lg">
                      {displayName
                        ? displayName.substring(0, 2).toUpperCase()
                        : "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {displaySubtitle}
                    </span>
                    {storeName && (
                      <span className="truncate text-[11px] text-primary font-medium">
                        🏪 {storeName}
                      </span>
                    )}
                    {userRole && (
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                        {userRole}
                      </span>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={profileHref}>
                <DropdownMenuItem className="flex cursor-pointer hover:bg-muted/50">
                  <UserRound />
                  Profil Akun
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="flex cursor-pointer hover:bg-destructive/50"
              onClick={handleLogoutClick}
            >
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
