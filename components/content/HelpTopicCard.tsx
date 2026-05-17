import Link from "next/link";
import { FurniCard } from "@/components/ui/FurniCard";

type HelpTopicCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export function HelpTopicCard({ icon, title, description, href, cta }: HelpTopicCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <FurniCard className="flex h-full flex-col p-5 transition group-hover:border-furni-primary/25">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-furni-accent/20 text-2xl transition group-hover:bg-furni-accent/35"
          aria-hidden
        >
          {icon}
        </span>
        <h2 className="mt-4 text-base font-semibold text-furni-primary">{title}</h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-furni-muted">{description}</p>
        <span className="mt-4 text-sm font-semibold text-furni-primary group-hover:underline">
          {cta} →
        </span>
      </FurniCard>
    </Link>
  );
}
