import Link from "next/link";
import { getAppDownloadLinks } from "@/lib/app-download";

function StoreBadge({
  href,
  label,
  sublabel,
  icon
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-w-[11rem] flex-1 items-center gap-3 rounded-2xl border border-furni-primary/15 bg-white px-4 py-3 shadow-soft transition hover:-translate-y-0.5 hover:border-furni-primary/25 hover:shadow-lift sm:max-w-[14rem]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-furni-primary/8 text-furni-primary">
        {icon}
      </span>
      <span className="text-left">
        <span className="block text-[10px] uppercase tracking-wide text-furni-muted">{sublabel}</span>
        <span className="block text-sm font-semibold text-furni-primary">{label}</span>
      </span>
    </a>
  );
}

export function AppStoreButtons({ layout = "row" }: { layout?: "row" | "stack" }) {
  const { ios, android, hasAny } = getAppDownloadLinks();

  if (!hasAny) {
    return (
      <div className="rounded-2xl border border-dashed border-furni-primary/20 bg-furni-surface px-5 py-4 text-sm text-furni-muted">
        <p className="font-medium text-furni-primary">Get the Covmerc app</p>
        <p className="mt-1 leading-relaxed">
          Search <strong className="text-furni-primary">Covmerc</strong> on the App Store or Google
          Play, or{" "}
          <Link href="/contact" className="font-medium text-furni-primary underline">
            contact us
          </Link>{" "}
          for download links.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3 ${layout === "stack" ? "flex-col" : "flex-col sm:flex-row sm:flex-wrap"}`}
    >
      {ios ? (
        <StoreBadge
          href={ios}
          sublabel="Download on the"
          label="App Store"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          }
        />
      ) : null}
      {android ? (
        <StoreBadge
          href={android}
          sublabel="Get it on"
          label="Google Play"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M3.18 23.76c.41.24.9.26 1.33.05l12.14-7.01-2.53-2.53-10.94 9.49zm-1.12-20.9c-.24.41-.26.88-.05 1.3l9.49 10.94 2.53-2.53L2.01 1.74A1.5 1.5 0 0 0 2.06 2.86zm17.73 8.1-2.74-1.58-2.9 2.9 2.9 2.9 2.74-1.58c.78-.45 1.17-1.28 1.17-2.12s-.39-1.67-1.17-2.12zM5.01 11.99l2.9-2.9L3.18 7.51A1.5 1.5 0 0 0 2.06 8.63l3.95 3.36zm7.19-4.47 10.94-6.33c.43-.21.92-.19 1.33.05a1.5 1.5 0 0 1 .72 1.28L12.2 7.52 12.2 7.52z" />
            </svg>
          }
        />
      ) : null}
    </div>
  );
}
