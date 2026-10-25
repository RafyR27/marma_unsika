"use client";

import Image from "next/image";

const kategori_list = [
  {
    id: 1,
    name: "Buah Lokal",
    slug: "buah-lokal",
    description: "Beragam buah segar hasil petani lokal.",
    isActive: true,
  },
  {
    id: 2,
    name: "Buah Impor",
    slug: "buah-impor",
    description: "Buah pilihan berkualitas dari berbagai negara.",
    isActive: true,
  },
  {
    id: 3,
    name: "Buah Tropis",
    slug: "buah-tropis",
    description: "Buah tropis dengan rasa manis dan menyegarkan.",
    isActive: true,
  },
  {
    id: 4,
    name: "Buah Organik",
    slug: "buah-organik",
    description: "Pilihan buah yang dibudidayakan dengan metode organik.",
    isActive: true,
  },
  {
    id: 5,
    name: "Paket Buah",
    slug: "paket-buah",
    description: "Paket aneka buah untuk kebutuhan harian dan hadiah.",
    isActive: true,
  },
  {
    id: 6,
    name: "Buah Potong",
    slug: "buah-potong",
    description: "Buah segar yang sudah dipotong dan siap dikonsumsi.",
    isActive: true,
  },
  {
    id: 7,
    name: "Buah Musiman",
    slug: "buah-musiman",
    description: "Buah pilihan yang tersedia sesuai musim panen.",
    isActive: true,
  },
  {
    id: 8,
    name: "Buah Kering",
    slug: "buah-kering",
    description: "Aneka buah kering untuk camilan dan kebutuhan lainnya.",
    isActive: true,
  },
];

const Kategori = () => {
  const kategoriList = kategori_list;

  return (
    <div className="w-full h-30 p-3 border rounded-md">
      <h1>Kategori</h1>
    </div>
  );
};

export { Kategori };
