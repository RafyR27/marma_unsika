"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/test.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-primary/70" />

        <div className="relative z-10 flex h-full flex-col justify-end p-12">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-background/70">
              Marma
            </p>

            <h2 className="text-4xl font-bold leading-tight text-background">
              Nikmati buah segar dimana saja dan kapan saja dengan Marma
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center px-5 lg:px-10 lg:h-screen lg:overflow-y-auto">
        <div className="flex justify-start w-full py-3">
          {/* <Image
            src={"/test.jpg"}
            alt=""
            width={120}
            height={120}
          /> */}
        </div>

        {children}
    
        <p className="max-w-md text-center text-muted-foreground text-[0.75rem] px-5 py-4">
          Dengan masuk, anda menyetujui Syarat & Ketentuan serta Kebijakan
          Privasi kami, dan bersedia menerima informasi serta pembaruan terkait
          layanan kami.
        </p>
      </div>
    </div>
  );
}
