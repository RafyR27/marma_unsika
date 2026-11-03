"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import chat from "@/services/chat.service";

export interface IChatConversation {
  id: string | number;
  contactName: string;
  storeName: string;
  phone: string;
  role: "buyer" | "helpdesk" | "courier" | "seller";
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: {
    id: string | number;
    sender: "me" | "them";
    text: string;
    time: string;
  }[];
}

export const initialChats: IChatConversation[] = [];

export const useSellerChats = () => {
  const [localConversations] = useState<IChatConversation[]>(initialChats);
  const [selectedChatId, setSelectedChatId] = useState<string | number>("");
  const [replyInput, setReplyInput] = useState<string>("");

  const { data: remoteConversations, refetch } = useQuery({
    queryKey: ["seller", "chats"],
    queryFn: async () => {
      const res = await chat.getConversations();
      return res.data?.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const conversations: IChatConversation[] =
    remoteConversations && remoteConversations.length > 0
      ? remoteConversations.map((c) => ({
          id: c.id,
          contactName: c.contact_name,
          storeName: c.store_name || "Pelanggan Pasar",
          phone: c.phone || "-",
          role: c.role,
          lastMessage: c.last_message,
          time: c.last_message_at,
          unreadCount: c.unread_count,
          messages:
            c.messages?.map((m) => ({
              id: m.id,
              sender: m.sender_role === "seller" ? ("me" as const) : ("them" as const),
              text: m.message,
              time: m.created_at,
            })) || [],
        }))
      : localConversations;

  const activeConversation = conversations.find((c) => String(c.id) === String(selectedChatId));

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeConversation) return;

    const messageText = replyInput.trim();

    try {
      await chat.sendMessage(selectedChatId, { message: messageText });
      refetch();
      toast.success("Pesan terkirim ke pelanggan", { position: "top-right" });
    } catch {
      toast.info(
        "Fitur perpesanan langsung saat ini sedang menunggu integrasi modul chat backend.",
        { position: "top-right" }
      );
    }

    setReplyInput("");
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
