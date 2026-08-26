import Reveal from "@/components/reveal";

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: string;
  description?: string;
}

/** En-tête de section : numérotation mono + titre Clash Display. */
export default function SectionHeading({
  index,
  kicker,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-14">
      <p className="mb-4 font-mono text-xs text-muted-foreground">
        <span className="text-primary-ink">{index}</span> / {kicker}
      </p>
      <h2 className="max-w-2xl text-balance font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Reveal>
  );
}
