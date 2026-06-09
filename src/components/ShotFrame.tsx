import { Icons } from "./Icons";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Рамка-«окно» с реальным скриншотом приложения AquaCore. Заменяет рисованные
 * моки на настоящие экраны со статистикой.
 *
 * crop=true — показываем только верхнюю часть экрана (KPI + график),
 * чтобы блок в герое оставался компактным.
 */
export function ShotFrame({
  file,
  alt,
  label = "Реальный экран AquaCore",
  crop = false,
  className = "",
}: {
  file: string;
  alt: string;
  label?: string;
  crop?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-brand ${className}`}
    >
      <figcaption className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-rose-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-2 truncate text-xs font-medium text-ink-muted">{label}</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
          <Icons.check className="h-3 w-3" /> live
        </span>
      </figcaption>
      {crop ? (
        <div className="aspect-[7/5] w-full overflow-hidden">
          <img
            src={`${base}/screens/${file}`}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover object-top"
          />
        </div>
      ) : (
        <img
          src={`${base}/screens/${file}`}
          alt={alt}
          loading="lazy"
          className="block max-h-[560px] w-full object-cover object-top"
        />
      )}
    </figure>
  );
}
