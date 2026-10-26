"use client";

import { useQuery } from "@tanstack/react-query";
import category from "@/services/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "cn";
import Image from "next/image";
import { Layers } from "lucide-react";

interface KategoriProps {
  selectedCategory?: string | null;
  onSelectCategory?: (slug: string | null) => void;
}

const Kategori = ({ selectedCategory, onSelectCategory }: KategoriProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await category.getCategories();
      return response.data.data;
    },
  });

  return (
    <div className="w-full my-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Kategori Komoditas
        </h2>
        {selectedCategory && onSelectCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Tampilkan Semua
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-20 w-36 shrink-0 rounded-lg"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Tidak ada kategori tersedia.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory?.(null)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer min-w-28 shrink-0 hover:border-primary/60",
              !selectedCategory
                ? "bg-primary/10 border-primary text-primary font-medium shadow-xs"
                : "bg-card text-foreground"
            )}
          >
            <span className="text-2xl mb-1">🛒</span>
            <span className="text-xs font-medium leading-tight">Semua</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() =>
                  onSelectCategory?.(isSelected ? null : cat.slug)
                }
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer min-w-32 max-w-40 shrink-0 hover:border-primary/60",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-medium shadow-xs"
                    : "bg-card text-foreground"
                )}
              >
                {cat.image_url ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mb-1.5 shrink-0 bg-muted">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="text-2xl mb-1">🥬</span>
                )}
                <span className="text-xs font-medium line-clamp-1 leading-tight">
                  {cat.name}
                </span>
                {typeof cat.products_count === "number" && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {cat.products_count} produk
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { Kategori };
