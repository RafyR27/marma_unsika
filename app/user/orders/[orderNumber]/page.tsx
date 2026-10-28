"use client";

import { use, Suspense } from "react";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import OrderDetailSection from "@/components/views/OrderDetailSection/OrderDetailSection";

function OrderDetailContent({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  return <OrderDetailSection orderNumber={orderNumber} />;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  return (
    <MainLayout>
      <Suspense fallback={null}>
        <OrderDetailContent params={params} />
      </Suspense>
    </MainLayout>
  );
}
