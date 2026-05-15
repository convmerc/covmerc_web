import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "@/components/ui/icons";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniInput } from "@/components/ui/FurniInput";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8">
        <section className="mb-8 max-w-2xl animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Contact</p>
          <h1 className="mt-2 font-display text-5xl text-furni-primary">Get in Touch</h1>
          <p className="mt-3 text-sm leading-relaxed text-furni-muted">
            Reach out to Covmerc for product support, partnership opportunities,
            and design consultation requests.
          </p>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr,1fr]">
          <FurniCard className="animate-fade-up">
            <h2 className="text-xl font-semibold text-furni-primary">Send a Message</h2>
            <form className="mt-4 grid gap-3">
              <FurniInput label="Full Name" placeholder="Your full name" required />
              <FurniInput label="Email Address" placeholder="you@example.com" required />
              <FurniInput label="Subject" placeholder="How can we help?" required />
              <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
                <span className="text-xs font-medium">Message</span>
                <textarea
                  rows={6}
                  className="w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm text-furni-ink outline-none transition focus:border-furni-primary focus:ring-2 focus:ring-furni-primary/15"
                  placeholder="Tell us what you need..."
                  required
                />
              </label>
              <FurniButton type="submit" className="w-max">
                Send Message
              </FurniButton>
            </form>
          </FurniCard>

          <div className="grid gap-4">
            <FurniCard className="animate-fade-up">
              <h2 className="mb-3 text-lg font-semibold text-furni-primary">Contact Info</h2>
              <div className="space-y-2 text-sm text-furni-muted">
                <p className="inline-flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-furni-primary" />
                  18 Minimal Avenue, Victoria Island, Lagos
                </p>
                <p className="inline-flex items-center gap-2">
                  <FaPhone className="h-4 w-4 text-furni-primary" />
                  +234 901 234 5678
                </p>
                <p className="inline-flex items-center gap-2">
                  <FaEnvelope className="h-4 w-4 text-furni-primary" />
                  hello@covmerc.com
                </p>
              </div>
            </FurniCard>

            <FurniCard className="animate-fade-up">
              <h2 className="mb-2 text-lg font-semibold text-furni-primary">
                Business Hours
              </h2>
              <ul className="space-y-1 text-sm text-furni-muted">
                <li>Mon - Fri: 9:00 AM - 6:00 PM</li>
                <li>Saturday: 10:00 AM - 4:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </FurniCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
