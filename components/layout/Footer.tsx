import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { companyContact } from "@/lib/site-content";

const socialLinks = [
  { href: "https://instagram.com/covmerc", label: "Instagram" },
  { href: "https://facebook.com/covmerc", label: "Facebook" },
  { href: "https://x.com/covmerc", label: "X" },
  { href: "https://linkedin.com/company/covmerc", label: "LinkedIn" }
] as const;

const shopLinks = [
  { href: "/shop", label: "Shop Collection" },
  { href: "/about", label: "About Covmerc" },
  { href: "/blog", label: "Design Blog" }
] as const;

const helpLinks = [
  { href: "/support", label: "Help Center" },
  { href: "/contact", label: "Contact Us" },
  { href: "/account/orders", label: "Your Orders" }
] as const;

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" }
] as const;

export function Footer() {
  return (
    <footer className="border-t border-furni-primary/10 bg-white bg-gradient-to-b from-furni-surface to-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-furni-muted md:grid-cols-2 lg:grid-cols-5 md:px-6 lg:px-8">
        <div className="space-y-3 lg:col-span-1">
          <p className="font-display text-3xl text-furni-primary">Covmerc</p>
          <p className="max-w-sm text-sm leading-relaxed">
            Premium furniture and thoughtful design for modern Nigerian homes—shop online or in
            the Covmerc app.
          </p>
          <address className="space-y-1 text-xs not-italic">
            <p>{companyContact.address}</p>
            <p>
              <a href={`tel:${companyContact.phone.replace(/\s/g, "")}`} className="hover:text-furni-primary">
                {companyContact.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${companyContact.email}`} className="hover:text-furni-primary">
                {companyContact.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
            Shop & stories
          </p>
          <div className="grid gap-2">
            {shopLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-furni-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
            Customer help
          </p>
          <div className="grid gap-2">
            {helpLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-furni-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <NewsletterSignup className="lg:col-span-1" />

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
            Legal & social
          </p>
          <div className="mb-4 grid gap-2">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-furni-primary">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-furni-primary transition hover:text-furni-ink"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-furni-primary/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-furni-muted md:flex-row md:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Covmerc. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-furni-primary">
                {link.label}
              </Link>
            ))}
            <Link href="/support" className="hover:text-furni-primary">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
