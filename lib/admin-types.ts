export type AdminSupportTicket = {
  id: string;
  status: string;
  priority: string;
  subject: string;
  message: string;
  userId: string;
  userEmail: string;
  userName: string;
  assignedAdminId: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
};

export type AdminAnnouncement = {
  id: string;
  title: string;
  body: string;
  status: string;
  audience: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
};

export const SUPPORT_TICKET_STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
export const SUPPORT_TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const ANNOUNCEMENT_STATUSES = ["draft", "published", "archived"] as const;
export const ANNOUNCEMENT_AUDIENCES = ["all", "customers", "vendors", "admins"] as const;
export const VENDOR_STATUSES = ["pending", "approved", "rejected", "suspended"] as const;
