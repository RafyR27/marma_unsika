import instance from "@/lib/instance";
import {
  IChatConversationListResponse,
  IChatMessageListResponse,
  ICreateConversationRequest,
  ISendMessageRequest,
  ISingleChatConversationResponse,
  ISingleChatMessageResponse,
} from "@/types/chat";

const chat = {
  // Ambil seluruh daftar percakapan aktif pengguna (Pedagang / Pembeli / Kurir)
  getConversations: () =>
    instance.get<IChatConversationListResponse>("/chats"),

  // Ambil riwayat percakapan spesifik berdasarkan ID
  getConversationDetail: (conversationId: string | number) =>
    instance.get<ISingleChatConversationResponse>(`/chats/${conversationId}`),

  // Ambil seluruh riwayat pesan di dalam percakapan
  getMessages: (conversationId: string | number) =>
    instance.get<IChatMessageListResponse>(`/chats/${conversationId}/messages`),

  // Kirim pesan balasan baru
  sendMessage: (conversationId: string | number, payload: ISendMessageRequest) =>
    instance.post<ISingleChatMessageResponse>(
      `/chats/${conversationId}/messages`,
      payload
    ),

  // Tandai seluruh pesan dalam percakapan telah dibaca
  markAsRead: (conversationId: string | number) =>
    instance.patch<{ message: string }>(`/chats/${conversationId}/read`),

  // Memulai obrolan baru dengan pihak lain (misal: pembeli ke pedagang pasar)
  startConversation: (payload: ICreateConversationRequest) =>
    instance.post<ISingleChatConversationResponse>("/chats", payload),
};

export default chat;

