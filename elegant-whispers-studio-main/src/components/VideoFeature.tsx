import { useRef, useState } from "react";
import { Play } from "lucide-react";
import videoThumb from "@/assets/video-thumb.jpg";

type Props = {
  /** Drop the real file in later — the player is already wired up. */
  src?: string;
  poster?: string;
  caption?: string;
};

export function VideoFeature({
  src,
  poster = videoThumb,
  caption = "30 seconds of the prettiest smile",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [pending, setPending] = useState(false);

  const play = async () => {
    const el = videoRef.current;
    if (!el || !src) {
      setPending(true);
      window.setTimeout(() => setPending(false), 2200);
      return;
    }
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitEnterFullscreen)
        (el as any).webkitEnterFullscreen();
    } catch {
      /* fullscreen may be denied — still play inline */
    }
    void el.play();
  };

  return (
    <div className="relative mx-auto mt-10 w-full max-w-[440px]">
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[2rem] opacity-80 blur-md"
        style={{
          background:
            "conic-gradient(from 120deg, hsl(43 70% 65% / .6), hsl(344 45% 75% / .5), hsl(43 70% 65% / .6))",
        }}
      />
      <button
        type="button"
        onClick={play}
        aria-label={`Play video — ${caption}`}
        className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-card shadow-[var(--shadow-soft)]"
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <img
            src={poster}
            alt={caption}
            loading="lazy"
            width={1600}
            height={900}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-105"
          />
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            preload="none"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(336 12% 16% / .1) 0%, transparent 40%, hsl(336 12% 16% / .6) 100%)",
            }}
          />

          {/* play button */}
          <span className="absolute left-1/2 top-1/2 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/25 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white/40">
            <span
              aria-hidden
              className="absolute inset-0 animate-[ping_2.6s_ease-out_infinite] rounded-full border border-white/50"
            />
            <Play className="ml-1 h-7 w-7 text-white drop-shadow" fill="currentColor" />
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 text-center">
            <p className="font-script text-2xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.45)] sm:text-3xl">
              {caption}
            </p>
          </div>
        </div>
      </button>
      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
        {pending ? "coming soon · saved for you" : "tap to play · fullscreen"}
      </p>
    </div>
  );
}
