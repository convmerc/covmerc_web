import { FurniCard } from "@/components/ui/FurniCard";
import type { ProcessStep } from "@/lib/site-content";

export function ProcessSteps({
  title,
  description,
  steps
}: {
  title: string;
  description?: string;
  steps: readonly ProcessStep[];
}) {
  return (
    <section className="mt-14">
      <p className="covmerc-eyebrow">How it works</p>
      <h2 className="mt-2 font-display text-2xl text-furni-primary md:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-furni-muted md:text-base">
          {description}
        </p>
      ) : null}
      <ol className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title}>
            <FurniCard interactive={false} className="relative h-full overflow-hidden p-6">
              <span className="font-display text-5xl text-furni-primary/12">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-furni-primary">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-furni-muted">{step.description}</p>
            </FurniCard>
          </li>
        ))}
      </ol>
    </section>
  );
}
