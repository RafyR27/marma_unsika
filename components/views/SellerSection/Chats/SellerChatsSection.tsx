"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Phone,
  Store,
  User,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useSellerChats } from "./useSellerChats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerChatsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    conversations,
    selectedChatId,
    setSelectedChatId,
    activeConversation,
    replyInput,
    setReplyInput,
    handleSendMessage,
  } = useSellerChats();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const isSeller = user?.role === "seller" || user?.role === "admin";
  if (!isSeller) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Pedagang Pasar</h2>
        <p className="text-sm text-muted-foreground">
          Pusat komunikasi obrolan pelanggan ini hanya dapat diakses oleh mitra pedagang pasar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Seller
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Pusat Koordinasi & Chat Pembeli
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Koordinasikan pesanan grosir, spesifikasi kesegaran, atau ketersediaan stok pasokan dengan warung pembeli.
        </p>
      </div>

      {/* Tampilan Chat 2 Kolom */}
      <div className="border rounded-2xl bg-card shadow-xs overflow-hidden grid md:grid-cols-3 min-h-[550px]">
        {/* Kolom Kiri: Daftar Kontak Obrolan (1 Col) */}
        <div className="border-r flex flex-col justify-between bg-muted/20">
          <div className="p-3.5 border-b bg-card">
            <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Percakapan Terbuka ({conversations.length})
            </span>
          </div>

          <div className="divide-y overflow-y-auto flex-1">
            {conversations.map((conv) => {
              const isSelected = conv.id === selectedChatId;

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChatId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-colors space-y-1 ${
                    isSelected
                      ? "bg-primary/10 border-l-4 border-l-primary"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground truncate">
                      {conv.contactName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {conv.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground truncate">
                    {conv.storeName}
                  </p>

                  <p className="text-xs text-foreground/80 line-clamp-1 leading-snug">
                    {conv.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Area Isi Percakapan (2 Cols) */}
        <div className="md:col-span-2 flex flex-col justify-between h-full bg-background">
          {activeConversation ? (
            <>
              {/* Header Kontak Aktif */}
              <div className="p-4 border-b flex items-center justify-between bg-card">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {activeConversation.contactName}
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.2 rounded-full">
                      {activeConversation.role === "buyer"
                        ? "Warung Pembeli"
                        : "Helpdesk Pasar"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.storeName} · Telp: {activeConversation.phone}
                  </p>
                </div>

                <a
                  href={`https://wa.me/62${activeConversation.phone.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Buka WhatsApp
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Balon-balon Pesan */}
              <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-muted/10">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "me" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed space-y-1 shadow-xs ${
                        msg.sender === "me"
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-card border text-foreground rounded-bl-xs"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[10px] block text-right ${
                          msg.sender === "me"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input Balas Pesan */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t bg-card flex items-center gap-2"
              >
                <Input
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Ketik pesan koordinasi komoditas ke warung pemesan..."
                  className="text-xs h-10"
                />
                <Button type="submit" size="sm" className="h-10 px-4 font-semibold">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Kirim
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-2 h-full">
              <MessageSquare className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-xs">Pilih percakapan di kolom kiri untuk membaca pesan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
