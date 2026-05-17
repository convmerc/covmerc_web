import Link from "next/link";
import type { LegalSection, PolicyHighlight } from "@/lib/site-content";
import { FurniCard } from "@/components/ui/FurniCard";
import { PolicyHighlights } from "@/components/content/PolicyHighlights";

type LegalDocumentProps = {
  sections: LegalSection[];
  contactLabel: string;
  contactEmail: string;
  alternateHref: string;
  alternateLabel: string;
  highlights?: readonly PolicyHighlight[];
};

export function LegalDocument({
  sections,
  contactLabel,
  contactEmail,
  alternateHref,
  alternateLabel,
  highlights
}: LegalDocumentProps) {
  return (
    <div className="mt-8">
      {highlights && highlights.length > 0 ? (
        <div className="lg:hidden">
          <PolicyHighlights items={highlights} />
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,240px),1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <FurniCard interactive={false} className="p-5">
            <p className="covmerc-eyebrow">On this page</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-2 text-furni-muted transition hover:text-furni-primary"
                  >
                    <span className="font-mono text-xs text-furni-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-4 border-t border-furni-primary/10 pt-5 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-furni-primary">
                  {contactLabel}
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-1 block font-medium text-furni-primary hover:underline"
                >
                  {contactEmail}
                </a>
              </div>
              <Link
                href={alternateHref}
                className="block font-medium text-furni-primary hover:underline"
              >
                {alternateLabel} →
              </Link>
            </div>
          </FurniCard>
        </nav>

        <div className="min-w-0 space-y-6">
          {highlights && highlights.length > 0 ? (
            <div className="hidden lg:block">
              <PolicyHighlights items={highlights} />
            </div>
          ) : null}

          <FurniCard interactive={false} className="divide-y divide-furni-primary/10 p-0">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 px-6 py-8 md:px-8 first:rounded-t-3xl last:rounded-b-3xl"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-furni-accent/25 text-sm font-bold text-furni-primary">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl text-furni-primary md:text-2xl">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-3 text-sm leading-relaxed text-furni-muted md:text-[15px]">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                      {section.list ? (
                        <ul className="space-y-2 rounded-2xl bg-furni-surface p-4">
                          {section.list.map((item) => (
                            <li key={item.slice(0, 48)} className="flex gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-furni-accent" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </FurniCard>
        </div>
      </div>
    </div>
  );
}
