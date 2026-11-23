"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import category from "@/services/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "cn";
import Image from "next/image";
import { Layers, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

interface KategoriProps {
  selectedCategory?: string | null;
  onSelectCategory?: (slug: string | null, name?: string | null) => void;
}

const Kategori = ({ selectedCategory, onSelectCategory }: KategoriProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await category.getCategories();
      return response.data.data;
    },
  });

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, categories, isLoading]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = 260;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full my-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-lg tracking-tight">Kategori Komoditas</h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedCategory && onSelectCategory && (
            <button
              type="button"
              onClick={() => onSelectCategory(null, null)}
              className="text-xs text-primary hover:underline cursor-pointer mr-1 font-medium"
            >
              Tampilkan Semua
            </button>
          )}

          {/* Desktop Carousel Navigation */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={cn(
                "w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer",
                canScrollLeft
                  ? "bg-background hover:bg-muted text-foreground border-border"
                  : "bg-muted/40 text-muted-foreground/40 border-border/40 cursor-not-allowed"
              )}
              aria-label="Scroll kategori ke kiri"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={cn(
                "w-7 h-7 rounded-full border flex items-center justify-center transition-colors cursor-pointer",
                canScrollRight
                  ? "bg-background hover:bg-muted text-foreground border-border"
                  : "bg-muted/40 text-muted-foreground/40 border-border/40 cursor-not-allowed"
              )}
              aria-label="Scroll kategori ke kanan"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 px-0.5 scrollbar-none">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="w-28 sm:w-32 min-w-[112px] sm:min-w-[128px] h-[124px] sm:h-[130px] p-3 rounded-xl border border-border bg-card flex flex-col items-center justify-between shrink-0"
            >
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="w-full flex flex-col items-center gap-1">
                <Skeleton className="w-16 h-3 rounded" />
                <Skeleton className="w-10 h-2.5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="w-full p-6 text-center border rounded-xl bg-muted/20 text-muted-foreground text-sm">
          Tidak ada kategori komoditas tersedia.
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-3 pt-1 px-0.5 scrollbar-none scroll-smooth"
        >
          {/* Card: Semua Kategori */}
          <button
            type="button"
            onClick={() => onSelectCategory?.(null, null)}
            className={cn(
              "group w-28 sm:w-32 min-w-[112px] sm:min-w-[128px] max-w-[136px] h-[124px] sm:h-[130px] flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all cursor-pointer shrink-0 select-none",
              !selectedCategory
                ? "bg-primary/10 border-primary text-primary font-semibold ring-2 ring-primary/20 shadow-xs"
                : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted/40 shadow-xs"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shrink-0",
                !selectedCategory
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-primary/10 text-primary"
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-center gap-0.5 w-full">
              <span className="text-xs font-medium leading-tight">Semua</span>
              <span className="text-[10px] text-muted-foreground leading-none">
                Komoditas
              </span>
            </div>
          </button>

          {/* Cards: Master Kategori */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  onSelectCategory?.(
                    isSelected ? null : cat.slug,
                    isSelected ? null : cat.name
                  )
                }
                className={cn(
                  "group w-28 sm:w-32 min-w-[112px] sm:min-w-[128px] max-w-[136px] h-[124px] sm:h-[130px] flex flex-col items-center justify-between p-3 rounded-xl border text-center transition-all cursor-pointer shrink-0 select-none",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary font-semibold ring-2 ring-primary/20 shadow-xs"
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted/40 shadow-xs"
                )}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted/60 border border-border/50 group-hover:scale-105 transition-transform flex items-center justify-center">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xl select-none">🥬</span>
                  )}
                </div>

                <div className="flex flex-col items-center gap-0.5 w-full">
                  <span
                    className="text-xs font-medium line-clamp-2 leading-tight text-center break-words w-full"
                    title={cat.name}
                  >
                    {cat.name}
                  </span>
                  {typeof cat.products_count === "number" && (
                    <span className="text-[10px] text-muted-foreground leading-none">
                      {cat.products_count} produk
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { Kategori };
