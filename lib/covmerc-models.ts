/**
 * TypeScript mirrors of Flutter models in covmerc_app/lib/data/model/.
 * Field names match Firestore documents written by the mobile app.
 */

export type CovmercOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type CovmercPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type CovmercPaymentMethod = "cash" | "card" | "bankTransfer" | "wallet";

export type CovmercCategory = {
  id?: string;
  name: string;
};

export type CovmercAddress = {
  userId?: string;
  fullName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  landmark?: string;
  addressType?: string;
  isDefault?: boolean;
};

export type CovmercOrderItem = {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  total: number;
  vendorId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorBusinessInfo?: Record<string, unknown>;
};

export type CovmercOrder = {
  id?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  items: CovmercOrderItem[];
  vendorIds?: string[];
  deliveryAddress: CovmercAddress;
  subtotal: number;
  deliveryFee?: number;
  totalAmount: number;
  status?: CovmercOrderStatus;
  paymentStatus?: CovmercPaymentStatus;
  paymentMethod?: CovmercPaymentMethod;
  notes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  deliveryInstructions?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CovmercProduct = {
  id?: string;
  userId?: string;
  name?: string;
  price?: number;
  imageUrl?: string;
  imageUrls?: string[];
  processedImageUrls?: string[];
  categories?: CovmercCategory[];
  description?: string;
  discount?: number;
  rating?: number;
  colors?: string[];
  status?: string;
};

export type CovmercUser = {
  uid: string;
  name?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  userType?: string;
  photoUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isAdmin?: boolean;
  vendorStatus?: string;
  businessInfo?: Record<string, unknown>;
};
