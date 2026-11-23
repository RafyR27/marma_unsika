import { MainNavbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <div className="w-full flex-1">
        <MainNavbar />
        <div className="w-full flex justify-center">
          <section className="w-full max-w-6xl px-3 sm:px-5 mt-2 space-y-5 min-w-0">
            {children}
          </section>
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  );
}
