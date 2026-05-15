export type ProductCategory = "Chairs" | "Tables" | "Sofas";

export type FurniProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image: string;
  description: string;
  shortDescription: string;
  specs: {
    material: string;
    dimensions: string;
    weight: string;
    finish: string;
  };
  featured?: boolean;
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

export type FurniOrderStatus = "Pending" | "Shipped" | "Delivered";

export type FurniOrder = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: FurniOrderStatus;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutShipping = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
};
