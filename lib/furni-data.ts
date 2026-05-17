import type {
  FurniBlogPost,
  FurniOrder,
  FurniProduct,
  FurniTestimonial,
  ProductCategory
} from "@/lib/furni-types";

type ProductSeed = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image: string;
  description: string;
  shortDescription: string;
  specs: FurniProduct["specs"];
  featured?: boolean;
};

function defineSeedProduct(product: ProductSeed): FurniProduct {
  return {
    ...product,
    categoryName: product.category,
    originalPrice: product.price,
    discount: 0,
    imageUrls: [product.image],
    status: "approved",
    rating: 0
  };
}

const rawProducts: ProductSeed[] = [
  {
    id: "nordic-chair",
    name: "Nordic Chair",
    category: "Chairs",
    price: 185_000,
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80",
    description:
      "A sculpted oak frame with soft boucle upholstery designed for modern living spaces.",
    shortDescription: "Sculpted oak frame with boucle comfort.",
    specs: {
      material: "Oak wood, boucle fabric",
      dimensions: '68cm W x 74cm D x 78cm H',
      weight: "11kg",
      finish: "Natural matte lacquer"
    },
    featured: true
  },
  {
    id: "kruzo-aero-chair",
    name: "Kruzo Aero Chair",
    category: "Chairs",
    price: 245_000,
    stock: 9,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    description:
      "An airy accent chair with a curved backrest and high-density memory foam seat.",
    shortDescription: "Curved backrest and memory foam comfort.",
    specs: {
      material: "Steel frame, velvet blend",
      dimensions: '72cm W x 70cm D x 84cm H',
      weight: "12kg",
      finish: "Powder-coated black legs"
    },
    featured: true
  },
  {
    id: "ergonomic-chair",
    name: "Ergonomic Chair",
    category: "Chairs",
    price: 125_000,
    stock: 23,
    image:
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1200&q=80",
    description:
      "Designed for long seating sessions with breathable mesh and adjustable lumbar support.",
    shortDescription: "Everyday comfort with adjustable support.",
    specs: {
      material: "Mesh, molded polymer",
      dimensions: '62cm W x 61cm D x 102cm H',
      weight: "9kg",
      finish: "Graphite frame"
    }
  },
  {
    id: "haven-sofa",
    name: "Haven Sofa",
    category: "Sofas",
    price: 1_250_000,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1500&q=80",
    description:
      "A deep-seated three seater in performance linen with kiln-dried hardwood construction.",
    shortDescription: "Three-seater sofa with relaxed silhouette.",
    specs: {
      material: "Hardwood, linen blend",
      dimensions: '218cm W x 94cm D x 82cm H',
      weight: "56kg",
      finish: "Olive green fabric"
    },
    featured: true
  },
  {
    id: "walnut-dining-table",
    name: "Walnut Dining Table",
    category: "Tables",
    price: 890_000,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1200&q=80",
    description:
      "A handcrafted walnut table for six with beveled edges and a robust center support.",
    shortDescription: "Handcrafted walnut table for six guests.",
    specs: {
      material: "Solid walnut wood",
      dimensions: '180cm W x 90cm D x 75cm H',
      weight: "42kg",
      finish: "Rich walnut satin"
    }
  },
  {
    id: "alpine-coffee-table",
    name: "Alpine Coffee Table",
    category: "Tables",
    price: 320_000,
    stock: 16,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
    description:
      "A two-tier ashwood coffee table with concealed cable pass-through for tidy living rooms.",
    shortDescription: "Two-tier ashwood table with hidden storage.",
    specs: {
      material: "Ashwood, matte steel",
      dimensions: '120cm W x 60cm D x 42cm H',
      weight: "19kg",
      finish: "Natural ash"
    }
  }
];

export const initialProducts: FurniProduct[] = rawProducts.map(defineSeedProduct);

export const initialBlogPosts: FurniBlogPost[] = [
  {
    id: "sustainable-craftsmanship",
    slug: "sustainable-craftsmanship",
    status: "published",
    title: "Sustainable Craftsmanship in Every Joint",
    excerpt:
      "How Covmerc sources certified wood, low-emission fabrics, and timeless silhouettes to reduce waste.",
    content:
      "At Covmerc, we design each product to last for years—not for a single season of trends. Our workshop partners use certified timber, low-emission finishes, and modular joinery so pieces can be repaired, reupholstered, and passed on.\n\nWhen you buy a Covmerc chair or table, you are investing in fewer replacements over time. That is better for your home and for the workshops we work with across Nigeria.\n\nWe publish material certificates on request and prioritize suppliers who can trace wood origins. If you are furnishing a rental or family home and want guidance on durable finishes, our support team is happy to help.",
    coverImage:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    category: "Sustainability",
    publishedAt: "May 01, 2026",
    author: "Covmerc Editorial"
  },
  {
    id: "modern-living-tips",
    slug: "modern-living-tips",
    status: "published",
    title: "Modern Living Tips for Small Spaces",
    excerpt:
      "Practical layout ideas to make compact homes feel open, calm, and highly functional.",
    content:
      "Living in a compact apartment does not mean living with clutter. The trick is choosing fewer, better pieces—and letting negative space do some of the work.\n\nStart with one anchor item, such as a slim sofa or a dining table with integrated storage. Build around it with lighting and textiles rather than filling every corner with furniture.\n\nMirrors opposite windows, light-toned rugs, and furniture with raised legs all help a room feel larger. In Nigerian homes where entertaining matters, consider nesting tables or stackable seating you can tuck away after guests leave.",
    coverImage:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    category: "Lifestyle",
    publishedAt: "April 22, 2026",
    author: "Amina Okafor"
  },
  {
    id: "how-to-style-green-tones",
    slug: "how-to-style-green-tones",
    status: "published",
    title: "Styling Forest Green Interiors",
    excerpt:
      "Use earthy color accents and natural textures to build depth in your home.",
    content:
      "Forest green has become a favourite among Covmerc customers who want warmth without the heaviness of all-brown interiors. It pairs naturally with oak, brass, and cream textiles—think of it as a bridge between modern minimalism and classic Nigerian warmth.\n\nIf you are new to colour, introduce green through a single statement piece: a sofa, an accent chair, or even pantry-style open shelving in the kitchen zone. Layer in neutral walls and let plants echo the tone.\n\nAvoid matching every item in the same shade. Mix deep green with sage cushions or a patterned rug so the room feels collected, not catalogued.",
    coverImage:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80",
    category: "Design",
    publishedAt: "April 10, 2026",
    author: "Covmerc Studio"
  }
];

export const testimonials: FurniTestimonial[] = [
  {
    id: "amira",
    author: "Amira Sule",
    role: "Apartment Owner",
    quote:
      "The quality feels premium and the support team made delivery effortless. Covmerc transformed my living room in a week."
  },
  {
    id: "daniel",
    author: "Daniel Nwosu",
    role: "Interior Stylist",
    quote:
      "I use Covmerc pieces for client staging constantly. The materials are consistent and the finishes photograph beautifully."
  },
  {
    id: "rahimah",
    author: "Rahimah Bello",
    role: "First-time Home Buyer",
    quote:
      "From checkout to setup instructions, every step felt thoughtful. I appreciate the sustainable sourcing details on each product."
  }
];

export const whyChooseFeatures = [
  {
    title: "Fast & free shipping",
    description: "Delivery across major cities with transparent tracking."
  },
  {
    title: "Easy to shop",
    description: "Clear categories, rich product specs, and quick checkout."
  },
  {
    title: "24/7 support",
    description: "A responsive team for product guidance and aftercare."
  },
  {
    title: "Hassle-free returns",
    description: "Simple return process with quality assurance included."
  }
];

export const initialOrders: FurniOrder[] = [
  {
    id: "ORD-1001",
    customer: "Olivia Hart",
    items: 2,
    total: 498,
    status: "Pending",
    paymentStatus: "pending",
    paymentMethod: "cash",
    createdAt: "May 12, 2026"
  },
  {
    id: "ORD-1002",
    customer: "Joseph Kingsley",
    items: 1,
    total: 420,
    status: "Shipped",
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: "May 11, 2026"
  },
  {
    id: "ORD-1003",
    customer: "Lina Park",
    items: 3,
    total: 588,
    status: "Delivered",
    paymentStatus: "paid",
    paymentMethod: "bankTransfer",
    createdAt: "May 09, 2026"
  }
];
