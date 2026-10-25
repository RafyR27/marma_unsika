import {
  BanknoteIcon,
  CircleHelpIcon,
  ClipboardListIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  NavigationIcon,
  Settings2Icon,
  WalletIcon,
} from "lucide-react";

const SIDEBAR_COURIER = {
  navMain: [
    {
      title: "Dashboard",
      url: "/courier/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Tugas Tersedia",
      url: "/courier/available-tasks",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Pengiriman Aktif",
      url: "/courier/active-deliveries",
      icon: <NavigationIcon />,
    },
    {
      title: "Riwayat Pengiriman",
      url: "/courier/history",
      icon: <HistoryIcon />,
    },
    {
      title: "Area Layanan",
      url: "/courier/service-area",
      icon: <MapPinIcon />,
    },
  ],
  documents: [
    {
      title: "Pendapatan",
      url: "/courier/earnings",
      icon: <WalletIcon />,
    },
    {
      title: "Penarikan Dana",
      url: "/courier/withdrawals",
      icon: <BanknoteIcon />,
    },
  ],
  tools: [
    {
      title: "Pengaturan",
      url: "/courier/settings",
      icon: <Settings2Icon />,
    },
    {
      title: "Bantuan",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],
};

export { SIDEBAR_COURIER };
