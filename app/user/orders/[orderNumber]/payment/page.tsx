"use client";

import { use, Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import PaymentSection from "@/components/views/PaymentSection/PaymentSection";

function PaymentContent({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  return <PaymentSection orderNumber={orderNumber} />;
}

export default function OrderPaymentPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  return (
    <MainLayout>
      <Suspense fallback={null}>
        <PaymentContent params={params} />
      </Suspense>
    </MainLayout>
  );
}
