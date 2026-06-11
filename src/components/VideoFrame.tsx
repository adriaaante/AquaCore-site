import { Icons } from "./Icons";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Рамка-«окно» с зацикленным видео приложения AquaCore (сгенерировано из
 * реальных скриншотов системы). Видео автозапускается без звука и бесшовно
 * повторяется; постер — реальный кадр, поэтому до загрузки видео блок
 * выглядит как обычный скриншот.
 */
export function VideoFrame({
  file,
  poster,
  label = "AquaCore в работе",
  aspect = "aspect-video",
  className = "",
}: {
  /** Имя mp4-файла в public/videos (рядом ожидается одноимённый .webm) */
  file: string;
  /** Имя файла постера в public/videos */
  poster: string;
  label?: string;
  /** Tailwind-класс соотношения сторон контейнера */
  aspect?: string;
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
      <div className={`${aspect} w-full overflow-hidden`}>
        <video
          className="h-full w-full object-cover object-top"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${base}/videos/${poster}`}
        >
          <source
            src={`${base}/videos/${file.replace(/\.mp4$/, ".webm")}`}
            type="video/webm"
          />
          <source src={`${base}/videos/${file}`} type="video/mp4" />
          {/* Фолбэк для браузеров без поддержки video */}
          <img src={`${base}/videos/${poster}`} alt={label} loading="lazy" />
        </video>
      </div>
    </figure>
  );
}
