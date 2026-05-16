export type CovmercBusiness = {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessDescription: string;
  status: string;
};

export type CovmercAddress = {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  landmark?: string;
  addressType?: string;
  isDefault: boolean;
};

export type CovmercConversation = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  subject?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
};

export type CovmercChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isRead: boolean;
};
