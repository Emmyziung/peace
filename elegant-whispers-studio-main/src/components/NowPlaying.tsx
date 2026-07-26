import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Heart, ListMusic, ExternalLink } from "lucide-react";

const TRACKS = [
  { title: "At Last", artist: "Etta James", length: "3:00" },
  { title: "La Vie en Rose", artist: "Édith Piaf", length: "3:07" },
  { title: "Can't Help Falling in Love", artist: "Elvis Presley", length: "3:03" },
  { title: "Make You Feel My Love", artist: "Adele", length: "3:32" },
  { title: "Thinking Out Loud", artist: "Ed Sheeran", length: "4:41" },
  { title: "All of Me", artist: "John Legend", length: "4:29" },
  { title: "Perfect", artist: "Ed Sheeran", length: "4:23" },
  { title: "The Way You Look Tonight", artist: "Frank Sinatra", length: "3:22" },
];

export function NowPlaying() {
  const [playing, setPlaying] = useState(true);
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(28);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.4));
    }, 300);
    return () => window.clearInterval(t);
  }, [playing]);

  const track = TRACKS[idx];
  const next = () => {
    setIdx((v) => (v + 1) % TRACKS.length);
    setProgress(0);
  };
  const prev = () => {
    setIdx((v) => (v - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <>
      <div className="glass-card mx-auto max-w-xl rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-5">
          {/* vinyl */}
          <div
            className="relative h-20 w-20 shrink-0 rounded-full border border-accent/40 shadow-[var(--shadow-petal)]"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(344 45% 70%) 0 22%, hsl(336 12% 16%) 23% 60%, hsl(43 59% 52%) 61% 63%, hsl(336 12% 16%) 64% 100%)",
              animation: playing ? "spin 6s linear infinite" : undefined,
            }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent">
              now playing · for you
            </p>
            <p className="mt-1 truncate font-display text-2xl leading-tight">
              {track.title}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {track.artist}
            </p>
          </div>
          <Heart className="h-5 w-5 text-primary" fill="currentColor" />
        </div>

        {/* progress */}
        <div className="mt-6">
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress}%`,
                background: "var(--gradient-gold)",
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>
              {Math.floor((progress / 100) * 210 / 60)}:
              {String(Math.floor((progress / 100) * 210) % 60).padStart(2, "0")}
            </span>
            <span>{track.length}</span>
          </div>
        </div>

        {/* controls */}
        <div className="mt-5 flex items-center justify-center gap-6">
          <button
            onClick={() => setOpen(true)}
            className="text-muted-foreground transition hover:text-foreground"
            aria-label="Open playlist"
          >
            <ListMusic className="h-5 w-5" />
          </button>
          <button
            onClick={prev}
            className="text-foreground/80 transition hover:text-primary"
            aria-label="Previous"
          >
            <SkipBack className="h-6 w-6" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-[var(--color-primary-hover)]"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 pl-0.5" />}
          </button>
          <button
            onClick={next}
            className="text-foreground/80 transition hover:text-primary"
            aria-label="Next"
          >
            <SkipForward className="h-6 w-6" />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="text-xs uppercase tracking-[0.3em] text-accent transition hover:text-primary"
          >
            Playlist
          </button>
        </div>
      </div>

      {/* Playlist modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent">
                  YouTube Music
                </p>
                <h3 className="mt-1 font-display text-3xl">
                  Songs for you, my love
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {TRACKS.length} tracks · a candlelit hour
                </p>
              </div>
              <a
                href="#"
                className="mt-1 inline-flex items-center gap-1 rounded-full border border-accent/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition hover:bg-accent/10"
              >
                Open <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="gold-divider my-5" />

            <ol className="max-h-[50vh] space-y-1 overflow-y-auto pr-2">
              {TRACKS.map((t, i) => (
                <li key={t.title}>
                  <button
                    onClick={() => {
                      setIdx(i);
                      setProgress(0);
                      setPlaying(true);
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition hover:bg-muted ${
                      i === idx ? "bg-muted" : ""
                    }`}
                  >
                    <span className="w-5 text-right font-display text-sm text-accent">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg leading-tight">
                        {t.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.artist}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {t.length}
                    </span>
                    {i === idx && playing && (
                      <span className="flex h-4 items-end gap-[2px]">
                        <span className="w-[3px] animate-pulse bg-primary" style={{ height: "60%" }} />
                        <span className="w-[3px] animate-pulse bg-primary" style={{ height: "100%", animationDelay: ".15s" }} />
                        <span className="w-[3px] animate-pulse bg-primary" style={{ height: "40%", animationDelay: ".3s" }} />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
