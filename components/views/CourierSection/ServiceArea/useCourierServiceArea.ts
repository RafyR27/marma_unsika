"use client";

import { useState } from "react";

export interface IMarketHubZone {
  code: string;
  name: string;
  description: string;
  commodityType: string;
  totalStalls: number;
  pickupHub: string;
}

export interface IDeliveryZone {
  zoneName: string;
  coverage: string;
  estimatedTransitTime: string;
  deliveryFee: string;
  activeStalls: number;
}

export const marketHubZones: IMarketHubZone[] = [
  {
    code: "BLOK-A",
    name: "Blok A - Sayuran Daun & Hijau",
    description: "Lantai Dasar Sayur Basah (Kangkung, Bayam, Sawi, Kubis)",
    commodityType: "Sayuran Segar",
    totalStalls: 48,
    pickupHub: "Pintu Timur Gerbang 2",
  },
  {
    code: "BLOK-B",
    name: "Blok B - Cabai, Bawang & Bumbu Dapur",
    description: "Lantai 1 Sentra Bumbu (Cabai Keriting, Rawit, Bawang Merah/Putih Karungan)",
    commodityType: "Bumbu & Rempah Kering",
    totalStalls: 62,
    pickupHub: "Pos Timbangan Barat 1",
  },
  {
    code: "BLOK-C",
    name: "Blok C - Buah Segar Nusantara",
    description: "Gedung Buah Grosir (Jeruk, Pisang, Semangka, Melon Petian)",
    commodityType: "Buah-buahan",
    totalStalls: 35,
    pickupHub: "Loading Dock Utara",
  },
  {
    code: "BLOK-D",
    name: "Blok D - Umbi-umbian & Kacang",
    description: "Area Pergudangan Belakang (Kentang Dieng, Ubi, Kacang Tanah)",
    commodityType: "Umbi & Biji-bijian",
    totalStalls: 24,
    pickupHub: "Parkir Armada Logistik",
  },
];

export const deliveryCoverageZones: IDeliveryZone[] = [
  {
    zoneName: "Zona 1 - Sekitar Kampus UNSIKA",
    coverage: "Telukjambe Timur, Galuh Mas, Ronggowaluyo, Sukaharja",
    estimatedTransitTime: "15 - 25 Menit",
    deliveryFee: "Rp 15.000 - Rp 20.000",
    activeStalls: 85,
  },
  {
    zoneName: "Zona 2 - Karawang Kota & Barat",
    coverage: "Nagasanegara, Karangpawitan, Tanjungpura, Johar",
    estimatedTransitTime: "25 - 40 Menit",
    deliveryFee: "Rp 20.000 - Rp 25.000",
    activeStalls: 120,
  },
  {
    zoneName: "Zona 3 - Koridor Industri Klari & Kosambi",
    coverage: "Duren, Cibalongsari, Pancawati, Belendung",
    estimatedTransitTime: "35 - 50 Menit",
    deliveryFee: "Rp 25.000 - Rp 35.000",
    activeStalls: 45,
  },
];

export const useCourierServiceArea = () => {
  const [selectedHub, setSelectedHub] = useState<string>("BLOK-B");

  return {
    marketHubZones,
    deliveryCoverageZones,
    selectedHub,
    setSelectedHub,
  };
};
