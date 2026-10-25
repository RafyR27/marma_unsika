import { MainNavbar } from "@/components/common/navbar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="w-full min-h-screen">
      <MainNavbar />
      <div className="w-full flex justify-center">
        <section className="w-full max-w-6xl px-3 sm:px-5 mt-2 space-y-5">
          {children}
        </section>
      </div>
    </div>
  );
}
