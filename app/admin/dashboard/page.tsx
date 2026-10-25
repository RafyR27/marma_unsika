import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";

export default async function SuperAdminDashboardPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Dashboard Admin" />
    </SidebarLayout>
  );
}
