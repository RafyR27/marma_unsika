import { cn } from "cn";
import Image from "next/image";
import { Button } from "../ui/button";
import { Plus, Store } from "lucide-react";
import { IProduct } from "@/types/product";

interface ProductCardProps {
  product?: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const name = product?.name || "Melon Manis per Kg";
  const price = product?.formatted_price || "Rp. 10.000";
  const imageUrl = product?.image_url || "/test.jpg";
  const unit = product?.unit ? `/${product.unit}` : "";
  const storeName =
    product?.seller?.profile?.store_name || product?.seller?.name;
  const isAvailable = product?.is_available ?? true;

  return (
    <div className="w-full min-h-55 max-h-80 border rounded-md text-[0.9rem] flex flex-col justify-between overflow-hidden bg-card hover:shadow-md transition-shadow">
      <div className="relative w-full h-40 bg-muted">
        <Image
          src={imageUrl}
          alt={name}
          className="w-full h-40 object-cover rounded-t-md"
          width={300}
          height={300}
          unoptimized
        />
        {!isAvailable && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[0.7rem] px-2 py-0.5 rounded font-medium">
            Habis
          </span>
        )}
      </div>

      <div className="w-full flex flex-col justify-between p-3 gap-2 flex-1">
        <div>
          {storeName && (
            <p className="text-[0.75rem] text-muted-foreground flex items-center gap-1 mb-1 truncate">
              <Store className="w-3 h-3 shrink-0" />
              <span className="truncate">{storeName}</span>
            </p>
          )}
          <p
            className="w-full min-h-10 font-medium line-clamp-2 leading-snug"
            title={name}
          >
            {name}
          </p>
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

          <Button className="w-full" disabled={!isAvailable}>
            <Plus className="w-4 h-4 mr-1" />
            Keranjang
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
