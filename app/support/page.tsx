import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniCard } from "@/components/ui/FurniCard";

const supportItems = [
  {
    title: "Order Support",
    description: "Track order progress, delivery windows, and shipment updates.",
    icon: "🚚"
  },
  {
    title: "Product Guidance",
    description: "Get help selecting furniture size, finish, and material options.",
    icon: "?"
  },
  {
    title: "Returns & Refunds",
    description: "Start return requests and review refund timelines.",
    icon: "💬"
  },
  {
    title: "Live Assistance",
    description: "Chat with a Covmerc specialist for urgent account issues.",
    icon: "◌"
  }
] as const;

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Support</p>
          <h1 className="mt-2 font-display text-5xl text-furni-primary">
            How can we help?
          </h1>
          <p className="mt-3 text-sm text-furni-muted">
            Browse support categories or contact the Covmerc support team directly.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {supportItems.map((item) => (
            <FurniCard key={item.title} className="animate-fade-up">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-furni-primary/10 text-furni-primary">
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  {item.icon}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-furni-primary">{item.title}</h2>
              <p className="mt-1 text-sm text-furni-muted">{item.description}</p>
            </FurniCard>
          ))}
        </section>

        <FurniCard className="mt-6 text-sm text-furni-muted animate-fade-up">
          Need personalized help? Reach out through our{" "}
          <Link href="/contact" className="font-semibold text-furni-primary">
            Contact Us
          </Link>{" "}
          page and we will respond promptly.
        </FurniCard>
      </main>
      <Footer />
    </div>
  );
}
