import { trustPillars } from "@/lib/catalog-content";

export function TrustBar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "border-y border-white/10 bg-furni-primary/95"
          : "border-y border-furni-primary/10 bg-white"
      }
    >
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 md:px-6 lg:px-8">
        {trustPillars.map((item) => (
          <div key={item.title} className="flex gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${
                isDark ? "bg-white/10" : "bg-furni-primary/8"
              }`}
              aria-hidden
            >
              {item.icon}
            </span>
            <div>
              <p
                className={`text-sm font-semibold ${isDark ? "text-white" : "text-furni-primary"}`}
              >
                {item.title}
              </p>
              <p
                className={`mt-0.5 text-xs leading-relaxed ${isDark ? "text-white/70" : "text-furni-muted"}`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
