export type ProductCategory = "Chairs" | "Tables" | "Sofas";

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

export type FurniOrder = {
  id: string;
  customer: string;
  customerEmail?: string;
  items: number;
  subtotal?: number;
  deliveryFee?: number;
  total: number;
  status: FurniOrderStatus;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
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
