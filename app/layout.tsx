import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TanStackProvider } from "@/providers/tanstack-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const plusJakartaSans = localFont({
  src: "../public/fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "marma Unsika",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TanStackProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </TanStackProvider>
        <Toaster />
      </body>
    </html>
  );
}
