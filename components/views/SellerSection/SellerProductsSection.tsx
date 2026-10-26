"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMe } from "@/hooks/useMe";
import { useSellerProducts } from "./useSellerProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { ProductUnit } from "@/types/product";

const validUnits = ["kg", "ikat", "karung", "peti"] as const;

const productSchema = z.object({
  category_id: z.number().min(1, "Kategori wajib dipilih"),
  name: z.string().min(2, "Nama komoditas minimal 2 karakter"),
  description: z.string().optional(),
  price: z.number().min(1, "Harga harus minimal Rp 1"),
  unit: z.enum(validUnits, {
    message: "Satuan harus dipilih",
  }),
  min_order: z.number().min(1, "Minimal pesanan minimal 1"),
  stock: z.number().min(0, "Stok tidak boleh negatif"),
  image_url: z.string().optional(),
  is_available: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function SellerProductsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [searchInput, setSearchInput] = useState("");

  const {
    products,
    pagination,
    categories,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    page,
    setPage,
    isCreateOpen,
    setIsCreateOpen,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
    createProduct,
    isCreating,
    updateProduct,
    isUpdating,
    deleteProduct,
    isDeleting,
  } = useSellerProducts();

  // Create Form
  const createForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: 1,
      name: "",
      description: "",
      price: 10000,
      unit: "kg",
      min_order: 1,
      stock: 10,
      image_url: "",
      is_available: true,
    },
  });

  // Edit Form
  const editForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: 1,
      name: "",
      description: "",
      price: 10000,
      unit: "kg",
      min_order: 1,
      stock: 10,
      image_url: "",
      is_available: true,
    },
  });

  useEffect(() => {
    if (editingProduct) {
      const unitVal = (validUnits.includes(editingProduct.unit as (typeof validUnits)[number])
        ? editingProduct.unit
        : "kg") as (typeof validUnits)[number];

      editForm.reset({
        category_id: editingProduct.category_id,
        name: editingProduct.name,
        description: editingProduct.description || "",
        price: editingProduct.price,
        unit: unitVal,
        min_order: editingProduct.min_order,
        stock: editingProduct.stock,
        image_url: editingProduct.image_url || "",
        is_available: editingProduct.is_available,
      });
    }
  }, [editingProduct, editForm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  // Auth Guard
  if (isCheckingAuth) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const isSeller = user?.role === "seller" || user?.role === "admin";
  if (!isSeller) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Terbatas untuk Penjual</h2>
        <p className="text-sm text-muted-foreground">
          Halaman ini khusus untuk mitra pedagang pasar yang terdaftar sebagai Seller.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Ke Beranda
          </Button>
          <Button onClick={() => router.push("/auth/login")}>
            Masuk sebagai Seller
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header & Aksi Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Katalog Produk Kios</h1>
          <p className="text-sm text-muted-foreground">
            Kelola komoditas, stok, harga grosir, dan ketersediaan barang di kios Anda.
          </p>
        </div>
        <Button
          onClick={() => {
            createForm.reset({
              category_id: categories[0]?.id || 1,
              name: "",
              description: "",
              price: 10000,
              unit: "kg",
              min_order: 1,
              stock: 10,
              image_url: "",
              is_available: true,
            });
            setIsCreateOpen(true);
          }}
          className="flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </div>

      {/* Filter & Pencarian */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="Cari nama komoditas di kios Anda..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-9"
          />
          <Button type="submit" variant="secondary" size="sm">
            <Search className="w-4 h-4 mr-1" />
            Cari
          </Button>
        </form>
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Konten Utama */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data produk seller.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-4 bg-muted/20">
          <Package className="w-16 h-16 text-muted-foreground/50 mx-auto" />
          <h3 className="font-semibold text-lg">Belum Ada Komoditas di Kios</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {search
              ? "Tidak ada produk yang cocok dengan kata kunci pencarian Anda."
              : "Mulai pasarkan sayuran, buah, atau bumbu dapur segar Anda ke pedagang pasar kecil sekarang."}
          </p>
          {!search && (
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Produk Pertama
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Grosir</th>
                  <th className="py-3 px-4">Satuan</th>
                  <th className="py-3 px-4">Stok</th>
                  <th className="py-3 px-4">Min. Beli</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0 border">
                          <Image
                            src={item.image_url || "/test.jpg"}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-medium hover:text-primary transition-colors flex items-center gap-1 group"
                          >
                            <span>{item.name}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="text-[11px] text-muted-foreground block truncate max-w-xs">
                            {item.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                        {item.category?.name || "Umum"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">
                      {item.formatted_price}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                      /{item.unit}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          item.stock === 0 ? "text-destructive" : ""
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {item.min_order}
                    </td>
                    <td className="py-3 px-4">
                      {item.is_available && item.stock > 0 ? (
                        <span className="inline-flex items-center text-[11px] font-medium bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                          Tersedia
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-medium bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                          {item.stock === 0 ? "Habis" : "Non-aktif"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setEditingProduct(item)}
                          title="Edit produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeletingProduct(item)}
                          title="Hapus produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.meta && pagination.meta.last_page > 1 && (
            <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Halaman {pagination.meta.current_page} dari {pagination.meta.last_page} (Total: {pagination.meta.total} produk)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page >= pagination.meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: TAMBAH PRODUK */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Tambah Komoditas Baru
            </DialogTitle>
            <DialogDescription>
              Isi rincian komoditas pasar yang ingin Anda jual kepada pedagang pembeli.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={createForm.handleSubmit((values) =>
              createProduct({
                category_id: values.category_id,
                name: values.name,
                description: values.description || null,
                price: values.price,
                unit: values.unit,
                min_order: values.min_order,
                stock: values.stock,
                image_url: values.image_url || null,
                is_available: values.is_available,
              })
            )}
            className="space-y-4 py-2"
          >
            {/* Nama Produk */}
            <Controller
              name="name"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-name">Nama Komoditas</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id="create-name"
                      placeholder="Contoh: Cabai Rawit Merah Super"
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Kategori & Satuan */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="category_id"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-category">Kategori</FieldLabel>
                    <FieldContent>
                      <select
                        id="create-category"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-ring"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="unit"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-unit">Satuan Jual</FieldLabel>
                    <FieldContent>
                      <select
                        id="create-unit"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value as ProductUnit)
                        }
                        className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-ring"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ikat">Ikat</option>
                        <option value="karung">Karung</option>
                        <option value="peti">Peti</option>
                      </select>
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Harga & Min Order */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="price"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-price">Harga (Rp)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="create-price"
                        type="number"
                        min="1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="Contoh: 35000"
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="min_order"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-min-order">Min. Beli</FieldLabel>
                    <FieldContent>
                      <Input
                        id="create-min-order"
                        type="number"
                        min="1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="1"
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Stok & Status */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="stock"
                control={createForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="create-stock">Stok Tersedia</FieldLabel>
                    <FieldContent>
                      <Input
                        id="create-stock"
                        type="number"
                        min="0"
                        value={field.value !== undefined ? field.value : ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="100"
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="is_available"
                control={createForm.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="create-available">Status Etalase</FieldLabel>
                    <FieldContent className="pt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="create-available"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-input text-primary w-4 h-4 cursor-pointer"
                      />
                      <label
                        htmlFor="create-available"
                        className="text-xs cursor-pointer font-medium select-none"
                      >
                        Tampilkan di etalase
                      </label>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            {/* URL Gambar */}
            <Controller
              name="image_url"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="create-image">URL Foto Komoditas</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id="create-image"
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </FieldContent>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Masukkan URL tautan gambar online (opsional).
                  </p>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Deskripsi */}
            <Controller
              name="description"
              control={createForm.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="create-desc">Deskripsi Produk</FieldLabel>
                  <FieldContent>
                    <Textarea
                      {...field}
                      id="create-desc"
                      rows={2}
                      placeholder="Kondisi kesegaran, varietas, asal pasokan petani..."
                    />
                  </FieldContent>
                </Field>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isCreating}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Spinner /> : "Simpan Produk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: EDIT PRODUK */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" />
              Edit Produk: {editingProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Perbarui harga grosir, stok terkini, atau informasi komoditas ini.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={editForm.handleSubmit((values) => {
              if (!editingProduct) return;
              updateProduct({
                slug: editingProduct.slug,
                payload: {
                  category_id: values.category_id,
                  name: values.name,
                  description: values.description || null,
                  price: values.price,
                  unit: values.unit,
                  min_order: values.min_order,
                  stock: values.stock,
                  image_url: values.image_url || null,
                  is_available: values.is_available,
                },
              });
            })}
            className="space-y-4 py-2"
          >
            {/* Nama Produk */}
            <Controller
              name="name"
              control={editForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-name">Nama Komoditas</FieldLabel>
                  <FieldContent>
                    <Input {...field} id="edit-name" />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Kategori & Satuan */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="category_id"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-category">Kategori</FieldLabel>
                    <FieldContent>
                      <select
                        id="edit-category"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-ring"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="unit"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-unit">Satuan Jual</FieldLabel>
                    <FieldContent>
                      <select
                        id="edit-unit"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(e.target.value as ProductUnit)
                        }
                        className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-ring"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="ikat">Ikat</option>
                        <option value="karung">Karung</option>
                        <option value="peti">Peti</option>
                      </select>
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Harga & Min Order */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="price"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-price">Harga (Rp)</FieldLabel>
                    <FieldContent>
                      <Input
                        id="edit-price"
                        type="number"
                        min="1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="min_order"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-min-order">Min. Beli</FieldLabel>
                    <FieldContent>
                      <Input
                        id="edit-min-order"
                        type="number"
                        min="1"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Stok & Status */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="stock"
                control={editForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-stock">Sisa Stok</FieldLabel>
                    <FieldContent>
                      <Input
                        id="edit-stock"
                        type="number"
                        min="0"
                        value={field.value !== undefined ? field.value : ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="is_available"
                control={editForm.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="edit-available">Status Etalase</FieldLabel>
                    <FieldContent className="pt-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="edit-available"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-input text-primary w-4 h-4 cursor-pointer"
                      />
                      <label
                        htmlFor="edit-available"
                        className="text-xs cursor-pointer font-medium select-none"
                      >
                        Tersedia untuk dibeli
                      </label>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            {/* URL Gambar */}
            <Controller
              name="image_url"
              control={editForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-image">URL Foto Komoditas</FieldLabel>
                  <FieldContent>
                    <Input {...field} id="edit-image" type="url" />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Deskripsi */}
            <Controller
              name="description"
              control={editForm.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="edit-desc">Deskripsi Produk</FieldLabel>
                  <FieldContent>
                    <Textarea {...field} id="edit-desc" rows={2} />
                  </FieldContent>
                </Field>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProduct(null)}
                disabled={isUpdating}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Spinner /> : "Perbarui Produk"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: KONFIRMASI HAPUS */}
      <Dialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Hapus Produk
            </DialogTitle>
            <DialogDescription className="text-sm pt-2">
              Apakah Anda yakin ingin menghapus komoditas{" "}
              <strong className="text-foreground">
                {deletingProduct?.name}
              </strong>{" "}
              dari etalase kios? Produk tidak akan lagi terlihat oleh pembeli.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2 justify-end pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeletingProduct(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (deletingProduct) {
                  deleteProduct(deletingProduct.slug);
                }
              }}
            >
              {isDeleting ? <Spinner /> : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
