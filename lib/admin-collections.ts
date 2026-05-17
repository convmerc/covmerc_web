export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonPrimitive[];

export type ManagedCollectionConfig = {
  id: string;
  label: string;
  collectionPath: string;
  description: string;
  readOnly: boolean;
  editableFields: string[];
  createTemplate?: Record<string, JsonValue>;
};

/**
 * Keep this list aligned to your live Flutter collection names.
 * Shared collections are read-only by default to avoid model drift.
 */
export const MANAGED_COLLECTIONS: ManagedCollectionConfig[] = [
  {
    id: "users",
    label: "Users",
    collectionPath: "users",
    description:
      "Primary user profiles used by mobile clients. Read-only by default for web admins.",
    readOnly: true,
    editableFields: []
  },
  {
    id: "orders",
    label: "Orders",
    collectionPath: "orders",
    description:
      "Order lifecycle documents. Keep read-only unless you have strict parity with mobile models.",
    readOnly: true,
    editableFields: []
  },
  {
    id: "products",
    label: "Products",
    collectionPath: "products",
    description:
      "Product catalog synced with vendor flows in Flutter. Start as read-only for safety.",
    readOnly: true,
    editableFields: []
  },
  {
    id: "supportTickets",
    label: "Support Tickets",
    collectionPath: "supportTickets",
    description:
      "Admin-operational tickets. Writable fields are restricted to moderation metadata.",
    readOnly: false,
    editableFields: ["status", "priority", "assignedAdminId", "adminNote"],
    createTemplate: {
      status: "open",
      priority: "normal",
      assignedAdminId: "",
      adminNote: ""
    }
  },
  {
    id: "announcements",
    label: "Announcements",
    collectionPath: "announcements",
    description:
      "Web/admin announcements shown in clients. Restricted field allowlist avoids arbitrary schema writes.",
    readOnly: false,
    editableFields: ["title", "body", "status", "audience"],
    createTemplate: {
      title: "",
      body: "",
      status: "draft",
      audience: "all"
    }
  },
  {
    id: "blogPosts",
    label: "Blog Posts",
    collectionPath: "blogPosts",
    description:
      "Design journal articles for web and mobile. Use status published for live posts.",
    readOnly: false,
    editableFields: [
      "title",
      "slug",
      "excerpt",
      "content",
      "coverImage",
      "category",
      "author",
      "status"
    ],
    createTemplate: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "Design",
      author: "Covmerc Editorial",
      status: "draft"
    }
  }
];

export const MANAGED_COLLECTIONS_BY_ID: Record<string, ManagedCollectionConfig> =
  Object.fromEntries(MANAGED_COLLECTIONS.map((entry) => [entry.id, entry]));
