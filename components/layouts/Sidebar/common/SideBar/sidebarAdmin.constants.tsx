import {
  BookUser,
  CircleHelpIcon,
  LayoutDashboardIcon,
  Settings2Icon,
  PackageIcon,
  ReceiptTextIcon,
  BanknoteIcon,
  UserCheckIcon,
  AppleIcon,
  TicketPercentIcon,
  ShoppingCartIcon,
  BarChart3Icon,
} from "lucide-react";

const SIDEBAR_ADMIN = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Verifikasi Seller & Kurir",
      url: "/admin/verifikasi",
      icon: <UserCheckIcon />,
    },
    {
      title: "Manajemen Pengguna",
      url: "/admin/users-management",
      icon: <BookUser />,
    },
    {
      title: "Kategori Buah",
      url: "/admin/fruit-categories",
      icon: <AppleIcon />,
    },
    {
      title: "Katalog Produk",
      url: "/admin/product-catalog",
      icon: <PackageIcon />,
    },
    {
      title: "Promo & Voucher",
      url: "/admin/promos",
      icon: <TicketPercentIcon />,
    },
  ],
  documents: [
    {
      title: "Semua Pesanan",
      url: "/admin/orders",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Transaksi",
      url: "/admin/transactions",
      icon: <ReceiptTextIcon />,
    },
    {
      title: "Pencairan Dana",
      url: "/admin/reimbursement",
      icon: <BanknoteIcon />,
    },
    {
      title: "Laporan",
      url: "/admin/reports",
      icon: <BarChart3Icon />,
    },
  ],
  tools: [
    {
      title: "Pengaturan",
      url: "/admin/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
};

export { SIDEBAR_ADMIN };
