export type ProductCategory = string;

export type FurniProduct = {
  id: string;
  vendorId?: string;
  name: string;
  category: ProductCategory;
  categoryName: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  image: string;
  imageUrls: string[];
  description: string;
  shortDescription: string;
  specs: {
    material: string;
    dimensions: string;
    weight: string;
    finish: string;
  };
  featured?: boolean;
  status: string;
  rating: number;
};

export type FurniBlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedAt: string;
  author: string;
};

export type FurniTestimonial = {
  id: string;
  author: string;
  role: string;
  quote: string;
};

export type FurniOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export type FurniOrderLineItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  image?: string;
};

export type FurniDeliveryAddress = {
  fullName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
};

export type FurniOrder = {
  id: string;
  customer: string;
  customerEmail?: string;
  userId?: string;
  items: number;
  lineItems?: FurniOrderLineItem[];
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  status: FurniOrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
  deliveryAddress?: FurniDeliveryAddress;
  notes?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutShipping = {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
};
