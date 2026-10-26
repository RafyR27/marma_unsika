"use client";

import { cn } from "cn";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Plus, Store, Check } from "lucide-react";
import { IProduct } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cart from "@/services/cart.service";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const queryClient = useQueryClient();
  const [justAdded, setJustAdded] = useState(false);

  const name = product.name;
  const price = product.formatted_price;
  const imageUrl = product.image_url || "/test.jpg";
  const unit = product.unit ? `/${product.unit}` : "";
  const storeName =
    product.seller?.profile?.store_name || product.seller?.name;
  const isAvailable = product.is_available ?? true;

  const { mutate: handleAddToCart, isPending } = useMutation({
    mutationFn: () =>
      cart.addToCart({
        product_id: product.id,
        quantity: product.min_order || 1,
      }),
    onSuccess: () => {
      toast.success(`${name} ditambahkan ke keranjang`, {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      if (err?.response?.status === 401) {
        toast.error("Silakan masuk terlebih dahulu untuk belanja", {
          position: "top-right",
        });
      } else {
        toast.error(err?.response?.data?.message || err?.message || "Gagal menambahkan ke keranjang", {
          position: "top-right",
        });
      }
    },
  });

  return (
    <div className="w-full min-h-55 max-h-84 border rounded-md text-[0.9rem] flex flex-col justify-between overflow-hidden bg-card hover:shadow-md transition-shadow group">
      <Link
        href={`/products/${product.slug}`}
        className="relative w-full h-40 bg-muted block overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={name}
          className="w-full h-40 object-cover rounded-t-md group-hover:scale-105 transition-transform duration-200"
          width={300}
          height={300}
          unoptimized
        />
        {!isAvailable && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[0.7rem] px-2 py-0.5 rounded font-medium">
            Habis
          </span>
        )}
      </Link>

      <div className="w-full flex flex-col justify-between p-3 gap-2 flex-1">
        <div>
          {storeName && (
            <p className="text-[0.75rem] text-muted-foreground flex items-center gap-1 mb-1 truncate">
              <Store className="w-3 h-3 shrink-0" />
              <span className="truncate">{storeName}</span>
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <p
              className="w-full min-h-10 font-medium line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer"
              title={name}
            >
              {name}
            </p>
          </Link>
        </div>

        <div>
          <p className={cn("text-[1.1rem] font-semibold my-1 text-primary")}>
            {price}
            {unit && (
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                {unit}
              </span>
            )}
          </p>

          <Button
            className="w-full cursor-pointer"
            disabled={!isAvailable || isPending}
            onClick={() => handleAddToCart()}
          >
            {isPending ? (
              <Spinner />
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4 mr-1 text-green-300" />
                Ditambahkan
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                Keranjang
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
