/** Shared copy and contact details used across marketing & legal pages */

export const companyContact = {
  name: "Covmerc",
  tagline: "Modern furniture & interior studio",
  address: "12 Ring Road, Ibadan, Oyo State, Nigeria",
  phone: "+234 901 234 5678",
  email: "hello@covmerc.com",
  supportEmail: "support@covmerc.com",
  privacyEmail: "privacy@covmerc.com",
  legalEmail: "legal@covmerc.com",
  hours: {
    weekdays: "Monday – Friday: 9:00 AM – 6:00 PM WAT",
    saturday: "Saturday: 10:00 AM – 4:00 PM WAT",
    sunday: "Sunday: Closed (online orders still accepted)"
  }
} as const;

export const relatedPageGroups = {
  help: [
    { href: "/support", label: "Help Center", description: "FAQs, orders & returns" },
    { href: "/contact", label: "Contact Us", description: "Message our Ibadan team" }
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy", description: "How we handle your data" },
    { href: "/terms", label: "Terms of Service", description: "Shopping & account rules" },
    { href: "/shipping", label: "Shipping & delivery", description: "Timelines, fees, and tracking" },
    { href: "/returns", label: "Returns & refunds", description: "Eligibility and how to start a return" }
  ],
  explore: [
    { href: "/shop", label: "Shop Collection", description: "Browse curated furniture" },
    { href: "/sell", label: "Sell on Covmerc", description: "List furniture on our marketplace" },
    { href: "/about", label: "Our Story", description: "Craft, sourcing & values" },
    { href: "/blog", label: "Design Blog", description: "Tips for modern living" }
  ]
} as const;

export const sellPageSteps: ProcessStep[] = [
  {
    title: "Download the Covmerc app",
    description:
      "Vendor registration happens in our mobile app—the same account you use to shop on the web. Install Covmerc on iOS or Android to get started."
  },
  {
    title: "Register as a vendor",
    description:
      "Complete your business profile, upload verification details, and tell us about the furniture you make or source. Our team reviews every application."
  },
  {
    title: "List & sell nationwide",
    description:
      "Once approved, add products from the app. Manage listings, track orders, and grow sales from the vendor portal on this website."
  }
];

export const sellPageBenefits = [
  {
    icon: "📱",
    title: "One account everywhere",
    description:
      "Sign in on web and mobile with the same Covmerc profile—cart, orders, and vendor tools stay in sync."
  },
  {
    icon: "🛋️",
    title: "Reach more buyers",
    description:
      "Showcase chairs, tables, sofas, and decor to customers shopping Covmerc studio pieces and marketplace listings."
  },
  {
    icon: "✓",
    title: "Reviewed listings",
    description:
      "We check photos, specs, and pricing so buyers trust what they see—better conversions for serious makers."
  },
  {
    icon: "🚚",
    title: "Orders & fulfillment",
    description:
      "View vendor orders on the web dashboard, update buyers through Covmerc support, and coordinate delivery across Nigeria."
  }
] as const;

export const sellPageFaqs = [
  {
    question: "Do I need an account to learn about selling?",
    answer:
      "No. This page is open to everyone. Browse requirements and download the app without signing in. Create a Covmerc account when you apply in the app—or sign in on the web first if you already shop with us."
  },
  {
    question: "Why do I register in the app?",
    answer:
      "Vendor onboarding includes business verification and document uploads that are built into the Covmerc mobile app today—the same flow our makers already use. The web vendor portal is for day-to-day selling after you are approved."
  },
  {
    question: "How long does approval take?",
    answer:
      "Most applications are reviewed within a few business days. You will see your status in the app and can sign in here once your account is marked as an approved vendor."
  },
  {
    question: "What can I sell on Covmerc?",
    answer:
      "We focus on furniture and home pieces—chairs, tables, sofas, storage, lighting, and decor from verified makers and resellers. Listings must be accurate, well photographed, and available to fulfill across Nigeria."
  },
  {
    question: "Can I add products on the website?",
    answer:
      "Yes. Approved vendors can add products from the app or submit new listings from the web vendor portal (pending review before they go live)."
  }
] as const;

export const sellPageEligibility = [
  "Furniture makers, workshops, and showrooms in Nigeria",
  "Resellers with clear product photos and honest specifications",
  "Businesses able to fulfill orders and coordinate delivery",
  "Sellers willing to pass Covmerc listing review before going live"
] as const;

export const sellPageRequirements = [
  {
    title: "Business details",
    description: "Legal or trading name, contact phone, and city (we are headquartered in Ibadan)."
  },
  {
    title: "Verification documents",
    description: "ID and business proof as prompted in the app—required before approval."
  },
  {
    title: "Sample listings",
    description: "At least one product with clear photos, dimensions, materials, and pricing in Naira."
  },
  {
    title: "Fulfillment plan",
    description: "How you prepare, pack, and hand off orders for delivery across Nigeria."
  }
] as const;

export const sellPageHighlights = [
  { label: "Review time", value: "2–5 days", description: "Typical vendor application turnaround" },
  { label: "Market", value: "Nigeria", description: "Buyers nationwide, studio based in Ibadan" },
  { label: "Categories", value: "Furniture", description: "Home, living, dining & decor" }
] as const;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
};

export type PolicyHighlight = {
  icon: string;
  label: string;
  value: string;
  description?: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type HelpChannel = {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const policyLastUpdated = "May 16, 2026" as const;

export const shippingHighlights: PolicyHighlight[] = [
  { icon: "🚚", label: "Ibadan metro", value: "3–7 days", description: "In-stock items after payment" },
  { icon: "🇳🇬", label: "Nationwide", value: "7–14 days", description: "Major cities & hubs" },
  { icon: "💳", label: "Free delivery", value: "₦500k+", description: "Where noted at checkout" },
  { icon: "📦", label: "Metro fee from", value: "₦5,000", description: "Calculated by city & size" }
];

export const returnsHighlights: PolicyHighlight[] = [
  { icon: "↩️", label: "Return window", value: "14 days", description: "From delivery date" },
  { icon: "💰", label: "Refund timing", value: "7–14 days", description: "After inspection" },
  { icon: "📸", label: "Damage reports", value: "48 hours", description: "Include photos" },
  { icon: "🛋️", label: "Custom items", value: "Final sale", description: "Unless defective" }
];

export const privacyHighlights: PolicyHighlight[] = [
  { icon: "🔒", label: "We never", value: "Sell data", description: "Your info stays with Covmerc" },
  { icon: "☁️", label: "Hosted on", value: "Firebase", description: "Encrypted in transit" },
  { icon: "✉️", label: "Privacy requests", value: "24–72 hrs", description: "Typical response time" },
  { icon: "📱", label: "Syncs across", value: "Web + app", description: "One account experience" }
];

export const supportChannels: HelpChannel[] = [
  {
    icon: "📦",
    title: "Order & delivery",
    description: "Tracking, rescheduling, and delivery-day questions.",
    href: "/contact",
    cta: "Message support"
  },
  {
    icon: "↩️",
    title: "Returns & refunds",
    description: "Start a return and understand eligibility windows.",
    href: "/returns",
    cta: "Returns policy"
  },
  {
    icon: "🚚",
    title: "Shipping & fees",
    description: "Coverage, timelines, and free-delivery thresholds.",
    href: "/shipping",
    cta: "Delivery guide"
  },
  {
    icon: "👤",
    title: "Account & app",
    description: "Sign-in, profile updates, and syncing with mobile.",
    href: "/auth/login",
    cta: "Sign in"
  }
];

export const supportProcessSteps: ProcessStep[] = [
  {
    title: "Search or browse FAQs",
    description:
      "Most order, delivery, and care questions are answered below—no wait required."
  },
  {
    title: "Message us with context",
    description:
      "Use the contact form with your order number so we route you to the right specialist."
  },
  {
    title: "We resolve & follow up",
    description:
      "You will receive email updates. Urgent delivery issues are prioritized same business day."
  }
];

export const contactSlaCards = [
  {
    icon: "⚡",
    title: "Urgent delivery",
    value: "Same day",
    description: "Call during business hours for same-day delivery issues."
  },
  {
    icon: "✉️",
    title: "Email support",
    value: "< 24 hrs",
    description: "Weekday replies from our Ibadan studio team."
  },
  {
    icon: "🎨",
    title: "Design advice",
    value: "1–2 days",
    description: "Sizing and styling questions—we review your space notes."
  },
  {
    icon: "🤝",
    title: "Partnerships",
    value: "2–3 days",
    description: "Vendor and press inquiries reviewed by our partnerships lead."
  }
] as const;

export const privacySections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "Covmerc (“we”, “us”, “our”) operates the Covmerc website and mobile application. This Privacy Policy explains what information we collect, why we collect it, and the choices you have when you shop furniture, create an account, or contact our team.",
      "By using Covmerc, you agree to the practices described here. If you do not agree, please discontinue use of our services."
    ]
  },
  {
    id: "collect",
    title: "Information we collect",
    paragraphs: ["We collect information that helps us deliver orders, personalize your experience, and keep the platform secure:"],
    list: [
      "Account details: name, email address, phone number, and delivery addresses",
      "Order history: products purchased, payment status, and shipping updates",
      "Support messages: content you send through contact forms or in-app chat",
      "Device & usage data: app version, general location (city-level), and pages viewed",
      "Vendor listings (if applicable): product photos, descriptions, and business information you submit"
    ]
  },
  {
    id: "use",
    title: "How we use your information",
    paragraphs: ["We use personal data only for legitimate business purposes, including:"],
    list: [
      "Processing and fulfilling orders, including delivery coordination in Nigeria",
      "Authenticating your account and syncing preferences between web and mobile",
      "Sending transactional messages such as order confirmations and delivery updates",
      "Improving product discovery, inventory accuracy, and customer support",
      "Detecting fraud, abuse, and security incidents",
      "Complying with applicable legal obligations"
    ]
  },
  {
    id: "sharing",
    title: "When we share information",
    paragraphs: [
      "We do not sell your personal information. We may share limited data with trusted service providers who help us operate Covmerc—for example payment processors, delivery partners, cloud hosting (including Firebase/Google Cloud), and customer-support tools. These partners are contractually required to protect your data and use it only to perform services on our behalf.",
      "We may also disclose information if required by law, to protect our users, or in connection with a business transfer such as a merger or acquisition."
    ]
  },
  {
    id: "retention",
    title: "Data retention & security",
    paragraphs: [
      "We retain account and order records for as long as your account is active and as needed to meet legal, tax, and warranty obligations. Support tickets and contact form submissions are stored to resolve your request and improve our service.",
      "We implement administrative, technical, and organizational safeguards—including encrypted connections and access controls—to protect your information. No method of transmission over the internet is 100% secure, so we encourage strong passwords and prompt reporting of suspicious activity."
    ]
  },
  {
    id: "rights",
    title: "Your rights & choices",
    paragraphs: [
      "Depending on your location, you may have the right to access, correct, delete, or export your personal data, and to object to certain processing. To make a request, email us at privacy@covmerc.com with the subject line “Privacy Request” and include the email address associated with your account.",
      "You can update profile details in the Covmerc app or by contacting support. You may opt out of marketing emails using the unsubscribe link in any promotional message."
    ]
  },
  {
    id: "children",
    title: "Children’s privacy",
    paragraphs: [
      "Covmerc is not directed to children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us data, contact privacy@covmerc.com and we will delete it promptly."
    ]
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the “Last updated” date at the top of this page. Material changes may also be communicated via email or an in-app notice.",
      "Continued use of Covmerc after changes take effect constitutes acceptance of the updated policy."
    ]
  }
];

export const termsSections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to terms",
    paragraphs: [
      "These Terms of Service (“Terms”) govern your access to the Covmerc website, mobile application, and related services. By creating an account, placing an order, or browsing our catalog, you agree to these Terms and to our Privacy Policy.",
      "If you are using Covmerc on behalf of a business, you represent that you have authority to bind that business to these Terms."
    ]
  },
  {
    id: "accounts",
    title: "Accounts & eligibility",
    paragraphs: [
      "You must provide accurate registration information and keep your login credentials confidential. You are responsible for activity under your account. Notify us immediately at support@covmerc.com if you suspect unauthorized access.",
      "We may suspend or terminate accounts that violate these Terms, engage in fraud, or misuse the platform."
    ]
  },
  {
    id: "orders",
    title: "Orders, pricing & availability",
    paragraphs: [
      "Product descriptions, images, and prices are displayed as accurately as possible. Occasional errors may occur; we reserve the right to correct them and cancel affected orders with a full refund.",
      "An order is confirmed when you receive an order confirmation email or in-app notification. We may refuse or limit quantities to prevent reseller abuse or inventory errors.",
      "Prices are shown in Nigerian Naira unless otherwise stated and may include applicable taxes at checkout."
    ]
  },
  {
    id: "payment",
    title: "Payment & delivery",
    paragraphs: [
      "Payment must be completed using the methods offered at checkout. Delivery timelines are estimates and may vary based on your location within Nigeria, product availability, and carrier schedules.",
      "Risk of loss passes to you upon delivery to the address you provide. Please inspect items on delivery and report visible damage within 48 hours via our Support page or contact form."
    ]
  },
  {
    id: "returns",
    title: "Returns & refunds",
    paragraphs: [
      "Eligible items may be returned within the window stated on the product page or at checkout, provided they are unused and in original packaging. Custom-made or final-sale items may not be returnable.",
      "Refunds are issued to the original payment method after we receive and inspect the return. Shipping fees may be non-refundable unless the return is due to our error."
    ]
  },
  {
    id: "vendors",
    title: "Marketplace vendors",
    paragraphs: [
      "Some products are sold by independent vendors through Covmerc. Vendor listings must be accurate and comply with our content standards. Covmerc may remove listings that are misleading, unsafe, or infringe intellectual property rights.",
      "Disputes related to vendor-fulfilled orders should first be directed to Covmerc support so we can help coordinate resolution."
    ]
  },
  {
    id: "conduct",
    title: "Acceptable use",
    paragraphs: ["You agree not to:"],
    list: [
      "Use Covmerc for unlawful purposes or to harass others",
      "Attempt to bypass security, scrape data at scale, or disrupt our infrastructure",
      "Upload malware, false reviews, or content that infringes third-party rights",
      "Resell products obtained through Covmerc in violation of applicable agreements"
    ]
  },
  {
    id: "ip",
    title: "Intellectual property",
    paragraphs: [
      "Covmerc branding, website design, photography, and original content are owned by Covmerc or our licensors. You may not copy, modify, or distribute them without written permission.",
      "Product images supplied by vendors remain the property of their respective owners."
    ]
  },
  {
    id: "liability",
    title: "Disclaimers & limitation of liability",
    paragraphs: [
      "Covmerc is provided “as is” to the fullest extent permitted by law. We do not guarantee uninterrupted access or that every product will meet every personal preference.",
      "To the maximum extent permitted by law, Covmerc is not liable for indirect, incidental, or consequential damages arising from your use of the service. Our total liability for any claim related to an order is limited to the amount you paid for that order."
    ]
  },
  {
    id: "law",
    title: "Governing law & contact",
    paragraphs: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles. Disputes should first be raised with our support team at support@covmerc.com.",
      "For legal notices, contact legal@covmerc.com. Questions about privacy are handled under our Privacy Policy at /privacy."
    ]
  }
];

export type SupportFaq = {
  question: string;
  answer: string;
  href?: string;
  hrefLabel?: string;
};

export const supportFaqs: SupportFaq[] = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you will receive an email and in-app notification with tracking details. You can also view order status under Account → Orders when signed in on the web or in the Covmerc app.",
    href: "/account/orders",
    hrefLabel: "View your orders"
  },
  {
    question: "Can I change or cancel an order after checkout?",
    answer:
      "If your order has not entered production or left our warehouse, contact us within a few hours of placing it. Our team will do their best to accommodate changes—reach us via the contact form with your order number.",
    href: "/contact",
    hrefLabel: "Contact support"
  },
  {
    question: "What is your return policy?",
    answer:
      "Most standard furniture items can be returned within 14 days of delivery if unused and in original packaging. Custom pieces and clearance items may be final sale. See our Terms of Service for full details.",
    href: "/returns",
    hrefLabel: "Read returns policy"
  },
  {
    question: "Do you deliver outside Ibadan?",
    answer:
      "Yes. We deliver to major cities across Nigeria—including Lagos, Abuja, and Port Harcourt. Delivery fees and timelines are calculated at checkout based on your address and product size. Remote areas may require additional lead time.",
    href: "/shipping",
    hrefLabel: "Shipping & delivery"
  },
  {
    question: "What are delivery fees and free shipping?",
    answer:
      "Ibadan metro deliveries start from ₦5,000; nationwide from ₦8,500. Orders over ₦500,000 may qualify for free delivery where shown at checkout.",
    href: "/shipping",
    hrefLabel: "See fee details"
  },
  {
    question: "How do I report damage on delivery?",
    answer:
      "Contact us within 48 hours with photos of the packaging and product. We will arrange inspection, exchange, or refund depending on the situation.",
    href: "/returns",
    hrefLabel: "Damage & returns"
  },
  {
    question: "How do I care for wood and fabric finishes?",
    answer:
      "Each product page includes material and care notes. As a rule, use a soft dry cloth for wood, avoid direct sunlight on fabrics, and blot spills quickly. Our blog also publishes seasonal care guides.",
    href: "/blog",
    hrefLabel: "Browse care articles"
  },
  {
    question: "I’m a vendor—how do I list products?",
    answer:
      "Download the Covmerc app and register as a vendor. Our team reviews listings for quality and accuracy before they appear in the public catalog. For partnership questions, email hello@covmerc.com.",
    href: "/contact",
    hrefLabel: "Partnership inquiry"
  }
];

export const aboutMilestones = [
  {
    year: "2022",
    title: "Covmerc begins",
    description:
      "Started as a small studio in Ibadan curating locally made pieces for apartment owners who wanted durable design without showroom markups."
  },
  {
    year: "2024",
    title: "Mobile marketplace launch",
    description:
      "Released the Covmerc app so customers and verified vendors could discover, order, and track furniture from one trusted platform."
  },
  {
    year: "2026",
    title: "Studio & web experience",
    description:
      "Expanded our digital storefront and design editorial to help more Nigerians furnish thoughtfully—from first apartment to family home."
  }
] as const;

export const contactReasons = [
  {
    title: "Order & delivery",
    description: "Tracking, schedule changes, or delivery questions about an existing purchase.",
    email: "support@covmerc.com"
  },
  {
    title: "Product advice",
    description: "Dimensions, materials, and styling help before you buy—our team knows the catalog.",
    email: "hello@covmerc.com"
  },
  {
    title: "Partnerships & press",
    description: "Vendor onboarding, interior designers, media, and brand collaborations.",
    email: "hello@covmerc.com"
  },
  {
    title: "Privacy & legal",
    description: "Data requests, policy questions, or formal legal notices.",
    email: "privacy@covmerc.com"
  }
] as const;

export const shippingSections: LegalSection[] = [
  {
    id: "coverage",
    title: "Delivery coverage",
    paragraphs: [
      "Covmerc delivers across Nigeria from our Ibadan studio. Metro Ibadan (including Bodija, Ring Road, and Challenge) typically receives the fastest turnaround. Lagos, Abuja, and other states are fulfilled via our partner carriers with tracking shared by email and in your account.",
      "Large furniture items may require scheduled delivery windows. Our team will contact you on the phone number provided at checkout to confirm access, building rules, and a suitable time slot."
    ]
  },
  {
    id: "fees",
    title: "Delivery fees",
    paragraphs: [
      "Delivery fees are calculated at checkout based on your city and order subtotal. Ibadan metro deliveries start from ₦5,000; nationwide delivery from ₦8,500. Orders over ₦500,000 qualify for free delivery where noted at checkout.",
      "Fees cover standard curbside or in-home delivery as agreed with our logistics partner. Stair carries, assembly, and white-glove handling may incur additional charges—request a quote via Contact if needed."
    ]
  },
  {
    id: "timelines",
    title: "Estimated timelines",
    paragraphs: [
      "In-stock items in Ibadan: typically 3–7 business days after payment confirmation.",
      "Nationwide: typically 7–14 business days depending on destination and product availability.",
      "Made-to-order or vendor-fulfilled pieces may take longer; estimated lead times appear on the product page when applicable."
    ]
  },
  {
    id: "tracking",
    title: "Tracking your order",
    paragraphs: [
      "When your order ships, you will receive an email with tracking details. Signed-in customers can also view status and tracking under Account → Orders.",
      "If tracking has not updated within 48 hours of a “Shipped” status, contact support@covmerc.com with your order ID."
    ]
  },
  {
    id: "access",
    title: "Building access & assembly",
    paragraphs: [
      "Please provide accurate delivery instructions at checkout—gate codes, floor level, and whether a lift is available. Our carriers may need to reschedule if access is restricted.",
      "Basic assembly may be available in Ibadan for select items. White-glove delivery and full assembly can be quoted on request via our contact form."
    ],
    list: [
      "Measure doorways and stairwells before ordering large pieces",
      "Someone 18+ must be present to sign for delivery",
      "Report access issues before your scheduled window when possible"
    ]
  }
];

export const returnsSections: LegalSection[] = [
  {
    id: "eligibility",
    title: "Return eligibility",
    paragraphs: [
      "Most standard furniture items may be returned within 14 days of delivery if unused, in original packaging, and free from damage caused after delivery. Custom-made, clearance, and final-sale items are non-returnable unless defective.",
      "Mattresses and upholstered goods must be unused with hygiene seals intact. Assembly-required items should not be fully assembled if you plan to return them."
    ]
  },
  {
    id: "process",
    title: "How to start a return",
    paragraphs: [
      "Email support@covmerc.com or open a message from Account → Messages with your order ID, photos of the item, and reason for return. We will confirm eligibility and arrange pickup or drop-off instructions.",
      "Do not ship items back without an approved return authorization—unauthorized returns may be refused."
    ]
  },
  {
    id: "refunds",
    title: "Refunds",
    paragraphs: [
      "Approved refunds are issued to the original payment method within 7–14 business days after we receive and inspect the return. Card refunds may take an additional 3–5 business days to appear on your statement.",
      "Original delivery fees are non-refundable unless the return is due to our error or a defective item."
    ]
  },
  {
    id: "exchanges",
    title: "Exchanges & damage",
    paragraphs: [
      "Exchanges are treated as a return plus a new order. Contact us within 48 hours of delivery if you notice visible damage—include photos of the packaging and product.",
      "For vendor-fulfilled marketplace items, Covmerc coordinates with the seller on your behalf."
    ]
  },
  {
    id: "pickup",
    title: "Pickup & packaging",
    paragraphs: [
      "Approved returns in Ibadan may be collected by our logistics partner. Outside Ibadan, we will provide a return address or carrier label when applicable.",
      "Items must be securely repackaged in original materials where possible. We may deduct from your refund if items arrive damaged due to poor repackaging."
    ]
  }
];
