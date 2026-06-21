import { Icons } from "./Icons";
import { Reveal } from "./Reveal";

/* Фирменная иконка AquaCore (как в Logo / public/icon.svg) для «плитки» на экране */
function AquaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <defs>
        <linearGradient id="aqinstall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#aqinstall)" />
      <g transform="translate(256 256) scale(1.3) translate(-256 -242)">
        <path
          d="M256 96 c -50 80 -96 132 -96 196 a 96 96 0 0 0 192 0 c 0 -64 -46 -116 -96 -196 z"
          fill="#fff"
          fillOpacity="0.95"
        />
        <g transform="translate(256 292)" stroke="#0c4a6e" fill="none" strokeWidth="11">
          <ellipse rx="84" ry="36" transform="rotate(35)" />
          <ellipse rx="84" ry="36" transform="rotate(-35)" />
        </g>
        <circle cx="256" cy="292" r="26" fill="#0c4a6e" />
        <circle cx="320" cy="250" r="12" fill="#0c4a6e" />
        <circle cx="192" cy="334" r="12" fill="#0c4a6e" />
      </g>
    </svg>
  );
}

/* Декоративные «соседние» приложения на экране — нейтральные плитки */
const fillerApps = [
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-rose-600",
  "from-violet-400 to-purple-600",
  "from-sky-400 to-blue-600",
  "from-slate-400 to-slate-600",
  "from-pink-400 to-rose-500",
];

/**
 * Мокап домашнего экрана телефона.
 * os="ios"     — скруглённые квадраты иконок (как на iPhone)
 * os="android" — круглые иконки (как на Android)
 */
function PhoneHome({ os }: { os: "ios" | "android" }) {
  const isIos = os === "ios";
  const tile = isIos ? "rounded-[22%]" : "rounded-full";
  const label = isIos ? "iPhone · iOS" : "Android";

  return (
    <div className="relative mx-auto w-full max-w-[230px]">
      {/* Корпус */}
      <div className="relative overflow-hidden rounded-[2.6rem] border-[8px] border-slate-900 bg-slate-900 shadow-brand">
        {/* Экран с «обоями» */}
        <div className="relative aspect-[9/19] bg-gradient-to-b from-sky-100 via-slate-100 to-brand-100">
          {/* Чёлка / камера */}
          {isIos ? (
            <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
          ) : (
            <div className="absolute left-1/2 top-2.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-slate-900" />
          )}

          {/* Статус-бар */}
          <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-semibold text-slate-700">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <Icons.bolt className="h-2.5 w-2.5" />
            </span>
          </div>

          {/* Сетка приложений */}
          <div className="grid grid-cols-4 gap-x-3 gap-y-4 px-4 pt-6">
            {/* AquaCore — выделенная иконка */}
            <div className="flex flex-col items-center gap-1">
              <span
                className={`relative grid aspect-square w-full place-items-center overflow-hidden shadow-lg ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-100 ${tile}`}
              >
                <AquaIcon className="h-full w-full" />
              </span>
              <span className="text-[8px] font-bold leading-none text-slate-700">AquaCore</span>
            </div>

            {/* Соседние приложения */}
            {fillerApps.map((g, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span
                  className={`aspect-square w-full bg-gradient-to-br ${g} shadow ${tile}`}
                />
                <span className="h-1.5 w-7 rounded-full bg-slate-400/40" />
              </div>
            ))}
          </div>

          {/* Док */}
          <div className="absolute inset-x-3 bottom-3 flex justify-around rounded-2xl bg-white/50 p-2 backdrop-blur">
            {["from-blue-400 to-blue-600", "from-green-400 to-green-600", "from-orange-400 to-red-500", "from-slate-400 to-slate-600"].map(
              (g, i) => (
                <span key={i} className={`h-8 w-8 bg-gradient-to-br ${g} shadow ${tile}`} />
              ),
            )}
          </div>
        </div>
      </div>

      {/* Подпись под телефоном */}
      <p className="mt-3 text-center text-xs font-semibold text-ink-muted">{label}</p>

      {/* «Указатель» на иконку AquaCore */}
      <span className="absolute -right-2 top-16 inline-flex items-center gap-1 rounded-full bg-brand-gradient px-2.5 py-1 text-[10px] font-bold text-white shadow-brand sm:-right-4">
        Ваша мойка
      </span>
    </div>
  );
}

export function InstallApp() {
  const steps = [
    {
      icon: "link" as const,
      t: "Открываете AquaCore в браузере",
      d: "Сотрудник — на экране входа своей мойки, клиент — по ссылке мойки или QR-коду на кассе.",
    },
    {
      icon: "check" as const,
      t: "Добавляете на экран «Домой»",
      d: "Кнопка «Установить приложение»: на Android — в один тап, на iPhone — через «Поделиться → На экран „Домой“». Значок встаёт рядом с другими приложениями.",
    },
    {
      icon: "phone" as const,
      t: "Открываете в один тап",
      d: "Значок сразу открывает вашу мойку на весь экран, без адресной строки — искать ссылку больше не нужно.",
    },
  ];

  return (
    <section id="ustanovka" className="section">
      <div className="container-x grid min-w-0 items-center gap-12 lg:grid-cols-2 [&>*]:min-w-0">
        <Reveal>
          <span className="eyebrow">
            <Icons.phone className="h-3.5 w-3.5" /> У сотрудников и клиентов на телефоне
          </span>
          <h2 className="mt-5 h-title">Заходит как обычное приложение — ничего сложного</h2>
          <p className="lead mt-4">
            AquaCore не нужно искать и скачивать в App Store или Google Play. И сотрудники, и
            клиенты добавляют его на главный экран телефона за пару касаний — значок встаёт
            рядом с остальными приложениями и открывает приложение сразу на нужной мойке.
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map((s, i) => {
              const Icon = Icons[s.icon];
              return (
                <li key={s.t} className="flex gap-4">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-brand">
                    <Icon className="h-5 w-5" />
                    <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-ink text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{s.t}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{s.d}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-8 rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-ink-soft">
            <span className="font-semibold text-brand-700">Иконка открывает именно вашу мойку.</span>{" "}
            У каждой мойки свой значок и свой быстрый вход: сотрудник попадает в рабочий
            кабинет, клиент — в личный. Работает и на iPhone, и на Android.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-brand-gradient opacity-10 blur-2xl" />
            <div className="flex items-end justify-center gap-5 sm:gap-8">
              <div className="translate-y-4">
                <PhoneHome os="ios" />
              </div>
              <div className="-translate-y-2">
                <PhoneHome os="android" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
