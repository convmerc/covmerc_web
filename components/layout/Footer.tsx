import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter
} from "react-icons/fa";

export function Footer() {
  const socialLinks = [
    {
      href: "https://instagram.com/covmerc",
      label: "Instagram",
      Icon: FaInstagram
    },
    {
      href: "https://facebook.com/covmerc",
      label: "Facebook",
      Icon: FaFacebookF
    },
    {
      href: "https://x.com/covmerc",
      label: "X (Twitter)",
      Icon: FaTwitter
    },
    {
      href: "https://linkedin.com/company/covmerc",
      label: "LinkedIn",
      Icon: FaLinkedinIn
    }
  ] as const;

  return (
    <footer className="border-t border-furni-primary/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-furni-muted md:grid-cols-[1.2fr,1fr,1fr] md:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="font-display text-3xl text-furni-primary">Covmerc</p>
          <p className="max-w-sm text-sm leading-relaxed">
            Covmerc creates premium furniture experiences for modern homes with
            timeless craftsmanship and seamless digital commerce.
          </p>
          <div className="space-y-1 text-xs">
            <p className="inline-flex items-center gap-2">
              <FaMapMarkerAlt className="h-3.5 w-3.5 text-furni-primary" />
              18 Minimal Avenue, Victoria Island, Lagos
            </p>
            <p className="inline-flex items-center gap-2">
              <FaPhone className="h-3.5 w-3.5 text-furni-primary" />
              +234 901 234 5678
            </p>
            <p className="inline-flex items-center gap-2">
              <FaEnvelope className="h-3.5 w-3.5 text-furni-primary" />
              hello@covmerc.com
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
            Quick Links
          </p>
          <div className="grid gap-2">
            <Link href="/shop" className="hover:text-furni-primary">
              Shop Collection
            </Link>
            <Link href="/about" className="hover:text-furni-primary">
              About Covmerc
            </Link>
            <Link href="/blog" className="hover:text-furni-primary">
              Design Blog
            </Link>
            <Link href="/contact" className="hover:text-furni-primary">
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
            Social
          </p>
          <div className="mb-4 flex items-center gap-2">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-furni-surface text-furni-primary transition hover:-translate-y-0.5 hover:bg-furni-primary hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs leading-relaxed">
            Subscribe to receive modern living tips, launch updates, and weekly
            offers from Covmerc.
          </p>
        </div>
      </div>

      <div className="border-t border-furni-primary/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-furni-muted md:flex-row md:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Covmerc. All rights reserved.</p>
          <div className="flex gap-4 uppercase tracking-wide">
            <Link href="/privacy" className="hover:text-furni-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-furni-primary">
              Terms
            </Link>
            <Link href="/support" className="hover:text-furni-primary">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

