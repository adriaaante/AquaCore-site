"use client";

import { useEffect, useRef } from "react";

/**
 * <video>, который начинает воспроизведение С НАЧАЛА каждый раз, когда
 * пользователь долистывает до него. Ушёл из зоны видимости — пауза и сброс,
 * вернулся — ролик снова играет с первого кадра.
 */
export function AutoRestartVideo({
  className,
  poster,
  children,
}: {
  className?: string;
  poster?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            video.currentTime = 0;
            void video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      {children}
    </video>
  );
}
