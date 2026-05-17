import { redirect } from "next/navigation";

/** Operational shortcut — full editor lives in the data manager. */
export default function AdminSupportPage() {
  redirect("/admin/data/supportTickets");
}
