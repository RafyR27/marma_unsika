"use client";

import { useState } from "react";
import { toast } from "sonner";

export interface IChatConversation {
  id: string;
  contactName: string;
  storeName: string;
  phone: string;
  role: "buyer" | "helpdesk";
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: "me" | "them";
    text: string;
    time: string;
  }[];
}

export const initialChats: IChatConversation[] = [
  {
    id: "CHAT-01",
    contactName: "Bu Dewi Sri",
    storeName: "Kios Sayur Bu Dewi (Pasar Minggu)",
    phone: "081300000001",
    role: "buyer",
    lastMessage: "Pak Haji, untuk pesanan cabai keriting besok subuh tolong pilihkan yang merah tua ya.",
    time: "14:20",
    unreadCount: 1,
    messages: [
      {
        id: "M1",
        sender: "them",
        text: "Halo Pak Haji Syahril, apakah stok cabai merah keriting masih banyak?",
        time: "14:15",
      },
      {
        id: "M2",
        sender: "me",
        text: "Halo Bu Dewi, masih aman sekitar 200 kg baru datang dari Magelang tadi siang.",
        time: "14:18",
      },
      {
        id: "M3",
        sender: "them",
        text: "Pak Haji, untuk pesanan cabai keriting besok subuh tolong pilihkan yang merah tua ya.",
        time: "14:20",
      },
    ],
  },
  {
    id: "CHAT-02",
    contactName: "Helpdesk Pasar Makar",
    storeName: "Pos Koordinasi Operasional UNSIKA",
    phone: "081100000001",
    role: "helpdesk",
    lastMessage: "Pencairan dana penjualan kemarin telah disetujui kasir pasar.",
    time: "Kemarin",
    unreadCount: 0,
    messages: [
      {
        id: "M4",
        sender: "them",
        text: "Pencairan dana penjualan kemarin telah disetujui kasir pasar.",
        time: "Kemarin",
      },
    ],
  },
];

export const useSellerChats = () => {
  const [conversations, setConversations] = useState<IChatConversation[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string>("CHAT-01");
  const [replyInput, setReplyInput] = useState<string>("");

  const activeConversation = conversations.find((c) => c.id === selectedChatId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeConversation) return;

    const newMessage = {
      id: `M-${Date.now()}`,
      sender: "me" as const,
      text: replyInput.trim(),
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedChatId) {
          return {
            ...conv,
            lastMessage: newMessage.text,
            time: "Baru saja",
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    setReplyInput("");
    toast.success("Pesan terkirim", { position: "top-right" });
  };

  return {
    conversations,
    selectedChatId,
    setSelectedChatId,
    activeConversation,
    replyInput,
    setReplyInput,
    handleSendMessage,
  };
};
