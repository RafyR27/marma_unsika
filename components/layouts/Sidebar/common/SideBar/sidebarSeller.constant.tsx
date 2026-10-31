import {
  BanknoteIcon,
  BarChart3Icon,
  BoxesIcon,
  CircleHelpIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  Settings2Icon,
  ShoppingCartIcon,
  StarIcon,
  TruckIcon,
  WalletIcon,
} from "lucide-react";

const SIDEBAR_SELLER = {
  navMain: [
    {
      title: "Dashboard",
      url: "/seller/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Produk Saya",
      url: "/seller/products",
      icon: <PackageIcon />,
    },
    {
      title: "Stok & Kesegaran",
      url: "/seller/inventory",
      icon: <BoxesIcon />,
    },
    {
      title: "Pesanan Masuk",
      url: "/seller/orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Pengiriman",
      url: "/seller/shipments",
      icon: <TruckIcon />,
    },
    {
      title: "Ulasan Pembeli",
      url: "/seller/reviews",
      icon: <StarIcon />,
    },
    {
      title: "Chat Pembeli",
      url: "/seller/chats",
      icon: <MessageSquareIcon />,
    },
  ],
  documents: [
    {
      title: "Pendapatan",
      url: "/seller/earnings",
      icon: <WalletIcon />,
    },
    {
      title: "Penarikan Dana",
      url: "/seller/withdrawals",
      icon: <BanknoteIcon />,
    },
    {
      title: "Laporan Penjualan",
      url: "/seller/reports",
      icon: <BarChart3Icon />,
    },
  ],
  tools: [
    {
      title: "Pengaturan",
      url: "/seller/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
};

export { SIDEBAR_SELLER };
