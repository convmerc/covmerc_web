import Link from "next/link";
import type { LegalSection } from "@/lib/site-content";
import { FurniCard } from "@/components/ui/FurniCard";

type LegalDocumentProps = {
  sections: LegalSection[];
  contactLabel: string;
  contactEmail: string;
  alternateHref: string;
  alternateLabel: string;
};

export function LegalDocument({
  sections,
  contactLabel,
  contactEmail,
  alternateHref,
  alternateLabel
}: LegalDocumentProps) {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[220px,1fr]">
      <nav
        aria-label="On this page"
        className="lg:sticky lg:top-24 lg:self-start"
      >
        <FurniCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
            On this page
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-furni-muted transition hover:text-furni-primary"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-furni-primary/10 pt-4 text-xs text-furni-muted">
            <p>{contactLabel}</p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-1 block font-medium text-furni-primary hover:underline"
            >
              {contactEmail}
            </a>
            <Link
              href={alternateHref}
              className="mt-3 block font-medium text-furni-primary hover:underline"
            >
              {alternateLabel} →
            </Link>
          </div>
        </FurniCard>
      </nav>

      <FurniCard className="space-y-8 p-6 md:p-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-furni-primary">{section.title}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-furni-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul className="list-disc space-y-2 pl-5">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ))}
      </FurniCard>
    </div>
  );
}
