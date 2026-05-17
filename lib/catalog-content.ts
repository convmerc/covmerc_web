export const trustPillars = [
  {
    icon: "🚚",
    title: "Nationwide delivery",
    description: "Transparent timelines from Ibadan to Lagos, Abuja, PH & more"
  },
  {
    icon: "✓",
    title: "Verified makers",
    description: "Every listing reviewed for quality & accuracy"
  },
  {
    icon: "↩",
    title: "14-day returns",
    description: "Hassle-free on eligible standard items"
  },
  {
    icon: "💬",
    title: "Human support",
    description: "Ibadan team replies within one business day"
  }
] as const;

export const shopCategories = [
  {
    id: "Chairs",
    label: "Chairs",
    description: "Accent, dining & lounge seating built for daily comfort.",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "Tables",
    label: "Tables",
    description: "Dining, coffee & side tables with durable finishes.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "Sofas",
    label: "Sofas",
    description: "Deep-seated silhouettes for living rooms that host.",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80"
  }
] as const;

export const roomCollections = [
  {
    title: "Living room",
    description: "Sofas, coffee tables & accent chairs that anchor your space.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
    href: "/shop"
  },
  {
    title: "Dining & work",
    description: "Tables and chairs sized for meals, meetings, and WFH.",
    image:
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80",
    href: "/shop?category=Tables"
  },
  {
    title: "Compact homes",
    description: "Space-savvy pieces for apartments and starter flats.",
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1000&q=80",
    href: "/blog/modern-living-tips"
  }
] as const;

export const homeProcessSteps = [
  {
    step: "01",
    title: "Browse & compare",
    description:
      "Filter by category, read full specs, and save favourites—same catalog on web and the Covmerc app."
  },
  {
    step: "02",
    title: "Checkout with confidence",
    description:
      "Clear pricing in Naira, delivery estimates at checkout, and secure payment options."
  },
  {
    step: "03",
    title: "Delivered & supported",
    description:
      "Track your order, get setup tips, and reach our team if anything needs adjusting."
  }
] as const;

export const shopHighlights = [
  {
    title: "Materials you can trust",
    body: "Solid wood, performance fabrics, and finishes chosen to handle real Nigerian homes—not just showroom lighting."
  },
  {
    title: "Dimensions that make sense",
    body: "Every product page lists width, depth, and height so you can plan hallways, lifts, and room layouts before you buy."
  },
  {
    title: "One cart, two channels",
    body: "Start on the web, finish in the app—or vice versa. Your Covmerc account keeps orders and support in sync."
  }
] as const;
