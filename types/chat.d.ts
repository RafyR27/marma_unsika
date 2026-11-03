import { IAuthUser } from "./user";

export interface IChatMessage {
  id: string | number;
  conversation_id: string | number;
  sender_id: number;
  sender_role: "seller" | "buyer" | "courier" | "admin" | "helpdesk";
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: IAuthUser;
}

export interface IChatConversation {
  id: string | number;
  contact_name: string;
  store_name?: string;
  phone?: string;
  role: "buyer" | "seller" | "courier" | "helpdesk";
  last_message: string;
  last_message_at: string;
  unread_count: number;
  order_number?: string | null;
  participant?: IAuthUser;
  messages?: IChatMessage[];
}

export interface IChatConversationListResponse {
  data: IChatConversation[];
}

export interface IChatMessageListResponse {
  data: IChatMessage[];
}

export interface ISingleChatConversationResponse {
  message?: string;
  data: IChatConversation;
}

export interface ISingleChatMessageResponse {
  message?: string;
  data: IChatMessage;
}

export interface ISendMessageRequest {
  message: string;
}

export interface ICreateConversationRequest {
  target_user_id: number;
  order_number?: string;
  initial_message?: string;
}

