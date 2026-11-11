"use client";

import { useRouter } from "next/navigation";
import {
  BookUser,
  Search,
  ShieldCheck,
  UserX,
  UserCheck,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Store,
  MapPin,
  Truck,
  ShoppingBag,
  Plus,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminUsers } from "./useAdminUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminUsersSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();

  const {
    users,
    meta,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    togglingUser,
    setTogglingUser,
    executeUpdateStatus,
    isUpdatingStatus,
    // Create User States & Handlers
    isCreateModalOpen,
    setIsCreateModalOpen,
    createName,
    setCreateName,
    createPhone,
    setCreatePhone,
    createEmail,
    setCreateEmail,
    createPassword,
    setCreatePassword,
    createPasswordConfirmation,
    setCreatePasswordConfirmation,
    createRole,
    setCreateRole,
    createStoreName,
    setCreateStoreName,
    createMarketName,
    setCreateMarketName,
    createBlockNumber,
    setCreateBlockNumber,
    createFullAddress,
    setCreateFullAddress,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formErrors,
    handleCreateUser,
    isCreatingUser,
  } = useAdminUsers();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Administrator</h2>
        <p className="text-sm text-muted-foreground">
          Manajemen pengguna pasar hanya dapat diakses oleh tim pengelola resmi.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookUser className="w-6 h-6 text-primary" />
            Manajemen Pengguna Pasar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola akun pedagang pasar induk, warung pembeli, dan kurir operasional lapangan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </Button>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 border rounded-xl bg-card">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari nama pengguna, no. telepon, email, nama kios..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="text-xs">
            Cari
          </Button>
        </form>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Dropdown Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Peran (Role)</option>
            <option value="seller">Seller (Pedagang Pasar Induk)</option>
            <option value="buyer">Buyer (Warung / Pasar Kecil)</option>
            <option value="courier">Courier (Kurir Lapangan)</option>
            <option value="admin">Admin (Operasional)</option>
          </select>

          {/* Dropdown Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Status Akun</option>
            <option value="active">Hanya Akun Aktif</option>
            <option value="inactive">Hanya Akun Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Pengguna */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data pengguna dari server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <BookUser className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Tidak Ada Pengguna Ditemukan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || roleFilter !== "all" || statusFilter !== "all"
              ? "Tidak ada akun pengguna yang sesuai dengan filter pencarian."
              : "Belum ada akun pengguna terdaftar."}
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Nama Pengguna & Kontak</th>
                  <th className="py-3.5 px-4">Peran (Role)</th>
                  <th className="py-3.5 px-4">Profil Lapak / Warung</th>
                  <th className="py-3.5 px-4">Status Akun</th>
                  <th className="py-3.5 px-4 text-right">Aksi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {users.map((u) => {
                  const p = u.profile;
                  const isCurrentAdmin = u.id === user?.id;

                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      {/* Nama & Kontak */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground text-sm block">
                          {u.name}
                        </span>
                        <span className="text-muted-foreground text-[11px] block">
                          Telp: {u.phone}
                        </span>
                        {u.email && (
                          <span className="text-muted-foreground text-[11px] block">
                            {u.email}
                          </span>
                        )}
                      </td>

                      {/* Peran / Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1 ${
                            u.role === "seller"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : u.role === "courier"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                              : u.role === "admin"
                              ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {u.role === "seller" ? (
                            <>
                              <Store className="w-3 h-3" />
                              Pedagang Kios
                            </>
                          ) : u.role === "courier" ? (
                            <>
                              <Truck className="w-3 h-3" />
                              Kurir Lapangan
                            </>
                          ) : u.role === "admin" ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              Pembeli Warung
                            </>
                          )}
                        </span>
                      </td>

                      {/* Profil Toko/Lapak */}
                      <td className="py-3.5 px-4">
                        {p?.store_name ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-foreground block">
                              {p.store_name}
                            </span>
                            {p.market_name && (
                              <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {p.market_name} {p.block_number && `(${p.block_number})`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">
                            Belum ada profil toko
                          </span>
                        )}
                      </td>

                      {/* Status Akun */}
                      <td className="py-3.5 px-4">
                        {u.is_active ? (
                          <span className="inline-flex items-center text-[11px] font-semibold text-green-700 dark:text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full">
                            Nonaktif
                          </span>
                        )}
                      </td>

                      {/* Tombol Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        {isCurrentAdmin ? (
                          <span className="text-[11px] text-muted-foreground italic">
                            Akun Anda
                          </span>
                        ) : (
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setTogglingUser(u)}
                            className={`text-xs ${
                              u.is_active
                                ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                                : "text-green-600 hover:bg-green-500/10 hover:text-green-700"
                            }`}
                          >
                            {u.is_active ? (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                Nonaktifkan
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Aktifkan
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginasi Pengguna */}
          {meta && meta.last_page > 1 && (
            <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} pengguna)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page <= 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page >= meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL FORM TAMBAH PENGGUNA */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Tambah Akun Pengguna Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Daftarkan akun pengguna baru untuk pedagang pasar induk, warung pembeli, kurir, atau staf operasional.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 text-xs py-1">
            {/* Bagian 1: Data Identitas & Kontak */}
            <div className="space-y-3 p-3 rounded-lg border bg-muted/20">
              <span className="font-bold text-xs text-foreground block border-b pb-1">
                1. Data Akun & Kontak
              </span>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Nama Lengkap */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="user-name" className="font-semibold text-foreground">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="user-name"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Contoh: Pak Haji Syahril"
                    disabled={isCreatingUser}
                    className={formErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-[11px] text-destructive">{formErrors.name}</p>
                  )}
                </div>

                {/* Peran / Role */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="user-role" className="font-semibold text-foreground">
                    Peran Akun (Role) <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="user-role"
                    value={createRole}
                    onChange={(e) =>
                      setCreateRole(
                        e.target.value as "buyer" | "seller" | "courier" | "admin"
                      )
                    }
                    disabled={isCreatingUser}
                    className="h-9 px-3 rounded-md border border-input bg-background outline-none text-xs focus:border-ring cursor-pointer"
                  >
                    <option value="buyer">Buyer (Warung / Pembeli Grosir)</option>
                    <option value="seller">Seller (Pedagang Pasar Induk)</option>
                    <option value="courier">Courier (Kurir Pengantaran)</option>
                    <option value="admin">Admin (Operasional Pasar)</option>
                  </select>
                  {formErrors.role && (
                    <p className="text-[11px] text-destructive">{formErrors.role}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Nomor Telepon / WA */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="user-phone" className="font-semibold text-foreground">
                    Nomor WhatsApp / HP <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="user-phone"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    type="tel"
                    disabled={isCreatingUser}
                    className={formErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                    required
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-destructive">{formErrors.phone}</p>
                  )}
                </div>

                {/* Email (Opsional) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="user-email" className="font-semibold text-foreground">
                    Alamat Email (Opsional)
                  </label>
                  <Input
                    id="user-email"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="user@example.com"
                    type="email"
                    disabled={isCreatingUser}
                    className={formErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-destructive">{formErrors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 2: Kata Sandi & Keamanan */}
            <div className="space-y-3 p-3 rounded-lg border bg-muted/20">
              <span className="font-bold text-xs text-foreground block border-b pb-1">
                2. Kredensial Keamanan Akun
              </span>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Password */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="user-password" className="font-semibold text-foreground">
                    Kata Sandi <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="user-password"
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      type={showPassword ? "text" : "password"}
                      disabled={isCreatingUser}
                      className={`pr-8 ${
                        formErrors.password
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-[11px] text-destructive">{formErrors.password}</p>
                  )}
                </div>

                {/* Password Confirmation */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="user-password-confirmation"
                    className="font-semibold text-foreground"
                  >
                    Ulangi Kata Sandi <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="user-password-confirmation"
                      value={createPasswordConfirmation}
                      onChange={(e) => setCreatePasswordConfirmation(e.target.value)}
                      placeholder="Ketik ulang kata sandi"
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isCreatingUser}
                      className={`pr-8 ${
                        formErrors.password_confirmation
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {formErrors.password_confirmation && (
                    <p className="text-[11px] text-destructive">
                      {formErrors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bagian 3: Profil Toko / Lokasi (Relevan untuk Seller & Buyer) */}
            {(createRole === "seller" || createRole === "buyer") && (
              <div className="space-y-3 p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-xs text-foreground block border-b pb-1">
                  3. Informasi Lapak / Kios (Opsional)
                </span>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="user-store-name" className="font-semibold text-foreground">
                      Nama Kios / Warung
                    </label>
                    <Input
                      id="user-store-name"
                      value={createStoreName}
                      onChange={(e) => setCreateStoreName(e.target.value)}
                      placeholder="Contoh: Kios Berkah Tani"
                      disabled={isCreatingUser}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="user-market-name" className="font-semibold text-foreground">
                      Nama Pasar Induk
                    </label>
                    <Input
                      id="user-market-name"
                      value={createMarketName}
                      onChange={(e) => setCreateMarketName(e.target.value)}
                      placeholder="Contoh: Pasar Johar"
                      disabled={isCreatingUser}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="user-block-number" className="font-semibold text-foreground">
                      Nomor Blok / Kios
                    </label>
                    <Input
                      id="user-block-number"
                      value={createBlockNumber}
                      onChange={(e) => setCreateBlockNumber(e.target.value)}
                      placeholder="Contoh: Blok B No. 12"
                      disabled={isCreatingUser}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="user-address" className="font-semibold text-foreground">
                    Alamat Lengkap Kios / Warung
                  </label>
                  <Textarea
                    id="user-address"
                    value={createFullAddress}
                    onChange={(e) => setCreateFullAddress(e.target.value)}
                    placeholder="Alamat lengkap toko / kios penjemputan atau pengantaran barang"
                    rows={2}
                    disabled={isCreatingUser}
                    className="text-xs"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isCreatingUser}
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isCreatingUser || !createName.trim() || !createPhone.trim() || !createPassword}
                className="font-semibold flex items-center gap-1.5"
              >
                {isCreatingUser && <Spinner className="w-3.5 h-3.5" />}
                {isCreatingUser ? "Mendaftarkan..." : "Daftarkan Pengguna"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL KONFIRMASI UBAH STATUS AKUN */}
      <Dialog
        open={!!togglingUser}
        onOpenChange={(open) => !open && setTogglingUser(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              {togglingUser?.is_active ? (
                <>
                  <UserX className="w-5 h-5 text-destructive" />
                  Nonaktifkan Akun: {togglingUser?.name}?
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5 text-primary" />
                  Aktifkan Akun: {togglingUser?.name}?
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs pt-1 leading-relaxed">
              {togglingUser?.is_active
                ? "Menonaktifkan akun ini akan mencabut seluruh sesi token login secara otomatis. Pengguna tidak akan dapat mengakses platform sampai diaktifkan kembali."
                : "Pengguna akan kembali dapat masuk dan melakukan aktivitas operasional di platform pasar."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUpdatingStatus}
              onClick={() => setTogglingUser(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant={togglingUser?.is_active ? "destructive" : "default"}
              size="sm"
              disabled={isUpdatingStatus}
              onClick={() => {
                if (togglingUser) {
                  executeUpdateStatus({
                    userId: togglingUser.id,
                    isActive: !togglingUser.is_active,
                  });
                }
              }}
            >
              {isUpdatingStatus ? (
                <Spinner className="mr-1" />
              ) : togglingUser?.is_active ? (
                "Ya, Nonaktifkan Akun"
              ) : (
                "Ya, Aktifkan Akun"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
