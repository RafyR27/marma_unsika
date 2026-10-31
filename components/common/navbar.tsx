"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Search, ShoppingCart, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Separator } from "../ui/separator";
import { useMe } from "@/hooks/useMe";
import { useQuery } from "@tanstack/react-query";
import cart from "@/services/cart.service";
import LogoutDialog from "@/components/common/LogoutDialog";
import { getRoleDashboard } from "../views/AuthSection/LoginSection/useLogin";

const MainNavbar = () => {
  const router = useRouter();
  const { data: user } = useMe();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      router.push("/");
    }
  };

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cart.getCart();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    staleTime: 1000 * 30,
  });

  const cartTotalItems = cartData?.summary?.total_items || 0;
  const dashboardUrl = getRoleDashboard(user?.role);

  return (
    <>
      <nav className="w-full lg:h-20 h-18 bg-background lg:px-20 px-5 flex justify-between items-center gap-2 border-b">
        <div className="items-center gap-2 hidden md:block">
          <Link
            href={"/"}
            className="text-primary font-heading font-bold text-[1.3rem] tracking-tight"
          >
            Marma
          </Link>
        </div>

        <form onSubmit={handleNavSearch} className="lg:max-w-2xl max-w-lg w-full">
          <InputGroup className="w-full">
            <InputGroupAddon align="inline-start">
              <Search className="w-4 h-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Cari cabai, bawang, sayuran segar..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <button
                type="submit"
                className="cursor-pointer px-2 text-xs font-medium text-primary hover:text-primary/80"
              >
                Cari
              </button>
            </InputGroupAddon>
          </InputGroup>
        </form>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 lg:h-8 relative" nativeButton={false} render={
            <Link href={"/user/cart"} className="flex gap-2 px-2 items-center" />
          }>
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden md:inline">Keranjang</span>
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full size-5 flex items-center justify-center">
                {cartTotalItems}
              </span>
            )}
          </Button>

          <Separator
            orientation="vertical"
            className={"border hidden lg:block h-6"}
          />

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/user/orders">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden md:inline text-xs font-medium">
                    Pesanan
                  </span>
                </Button>
              </Link>
              {dashboardUrl !== "/" && (
                <Link href={dashboardUrl}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden md:inline text-xs font-medium">
                      {user.role === "seller" ? "Kios Saya" : "Dashboard"}
                    </span>
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLogoutOpen(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline text-xs">Keluar</span>
              </Button>
            </div>
          ) : (
            <div className="space-x-2 hidden lg:flex items-center">
              <Button variant="outline" size="sm" nativeButton={false} render={
                <Link href={"/auth/login"} className="px-3" />
              }>
                Masuk
              </Button>
              <Button variant="default" size="sm" nativeButton={false} render={
                <Link href={"/auth/register"} className="px-3" />
              }>
                Daftar
              </Button>
            </div>
          )}
        </div>
      </nav>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
};

export { MainNavbar };
