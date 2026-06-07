import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <h2 className="h-title">{title}</h2>
      {text && <p className="lead mt-4">{text}</p>}
    </Reveal>
  );
}

export function FeatureCard({
  icon,
  title,
  text,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  index?: number;
}) {
  return (
    <Reveal delay={(index % 3) * 80} className="h-full">
      <div className="card card-hover h-full">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </div>
        <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
      </div>
    </Reveal>
  );
}
