import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroImage from "@/assets/hero-roses.jpg";
import polaroid1 from "@/assets/polaroid-1.jpg";
import polaroid2 from "@/assets/polaroid-2.jpg";
import polaroid3 from "@/assets/polaroid-3.jpg";
import scratchReveal from "@/assets/scratch-reveal.jpg";
import { VideoFeature } from "@/components/VideoFeature";
import { NowPlaying } from "@/components/NowPlaying";
import { ScratchCard } from "@/components/ScratchCard";



export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "My Darling — A Love Letter" },
      {
        name: "description",
        content:
          "A romantic keepsake — soft petals, candlelight, and a letter written for you. From Emmanuel, with all my heart.",
      },
      { property: "og:title", content: "My Darling — A Love Letter" },
      {
        property: "og:description",
        content: "A romantic keepsake — soft petals, candlelight, and a letter written for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const NAMES = [
  "My Darling",
  "My Love",
  "My Beloved",
  "My Muse",
  "My Everything",
  "My Forever",
  "Mon Cœur",
];

function RotatingName() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("out"), 2600);
    const t2 = setTimeout(() => {
      setI((v) => (v + 1) % NAMES.length);
      setPhase("in");
    }, 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [i]);

  return (
    <span className="block h-[1.15em] overflow-hidden">
      <span
        key={i + phase}
        className="inline-block whitespace-nowrap bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
        style={{
          animation:
            phase === "in"
              ? "name-in 900ms cubic-bezier(.2,.7,.2,1) both"
              : "name-out 800ms cubic-bezier(.4,.1,.6,1) both",
        }}
      >
        {NAMES[i]}
      </span>
    </span>
  );
}


function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 12,
        drift: (Math.random() - 0.5) * 200,
        size: 14 + Math.random() * 22,
        rot: Math.random() * 360,
        hue: 340 + Math.random() * 20,
        light: 70 + Math.random() * 15,
        key: i,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <svg
          key={p.key}
          viewBox="0 0 32 32"
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rot}deg)`,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
            opacity: 0.75,
            filter: "drop-shadow(0 4px 6px hsl(336 25% 30% / .12))",
          }}
        >
          <path
            d="M16 2 C22 8, 28 14, 22 22 C18 27, 14 27, 10 22 C4 14, 10 8, 16 2 Z"
            fill={`hsl(${p.hue} 55% ${p.light}%)`}
          />
        </svg>
      ))}
    </div>
  );
}

function GoldDivider({ withRose = true }: { withRose?: boolean }) {
  return (
    <div className="flex items-center gap-4 my-10" aria-hidden>
      <div className="gold-divider flex-1" />
      {withRose && (
        <svg width="26" height="26" viewBox="0 0 32 32" className="text-accent">
          <path
            d="M16 4c4 2 6 5 6 8 0 3-3 5-6 5s-6-2-6-5c0-3 2-6 6-8Zm0 12c5 0 9 3 9 8 0 3-4 6-9 6s-9-3-9-6c0-5 4-8 9-8Z"
            fill="currentColor"
            opacity=".85"
          />
        </svg>
      )}
      <div className="gold-divider flex-1" />
    </div>
  );
}

function Polaroid({
  src,
  caption,
  rotate,
}: {
  src: string;
  caption: string;
  rotate: number;
}) {
  return (
    <figure
      className="bg-card p-3 pb-6 shadow-[var(--shadow-petal)] transition-transform duration-500 hover:rotate-0 hover:-translate-y-2"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <img
        src={src}
        alt={caption}
        loading="lazy"
        width={900}
        height={1100}
        className="w-full aspect-[4/5] object-cover"
      />
      <figcaption className="font-script text-2xl text-primary text-center mt-3">
        {caption}
      </figcaption>
    </figure>
  );
}

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Petals />

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center px-6 py-24">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, hsl(20 50% 98% / .55) 0%, hsl(20 50% 98% / .85) 60%, hsl(20 50% 98%) 100%)",
          }}
        />
        {/* candle glow */}
        <div
          aria-hidden
          className="candle-glow animate-flicker absolute left-1/2 top-1/2 -z-10 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />

        <div className="glass-card relative mx-auto w-full max-w-[560px] rounded-3xl px-6 py-14 text-center sm:w-[600px] sm:max-w-none sm:px-12">
          <p className="font-script text-3xl text-primary sm:text-4xl">to</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.15] sm:text-5xl">
            <RotatingName />
          </h1>
          <GoldDivider />
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            A quiet page for the loudest feeling I have — written by candlelight,
            with petals still on the desk, and your name on every line.
          </p>
          <VideoFeature />

        </div>

      </section>

      {/* LETTER */}
      <section id="letter" className="relative px-6 py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-accent">
            A letter, for you
          </p>
          <h2 className="mt-4 text-center font-display text-5xl sm:text-6xl">
            Everything I meant to say
          </h2>
          <GoldDivider />

          <div className="glass-card rounded-3xl px-7 py-12 sm:px-14 sm:py-16">
            <p className="font-script text-4xl text-primary">My love,</p>
            <div className="mt-6 space-y-6 font-display text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              <p>
                There are mornings that begin softly — a hush of light, the room
                warm — and even before I open my eyes, I am thinking of you. You
                are the first sweetness of the day.
              </p>
              <p>
                I have tried to catch what loving you feels like. It is
                candlelight in a quiet room. It is the last rose of summer, held
                gently between two hands. It is a promise, whispered, and then
                whispered again — because once was never enough.
              </p>
              <p>
                I love the small things most: the way you argue with movies, the
                way you fall asleep mid-sentence, the way a room becomes softer
                the moment you walk into it.
              </p>
              <p>
                So here — take this small, careful place. It is only paper and
                petals and light, but every line of it is yours.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-end">
              <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
                yours, always
              </p>
              <p className="mt-2 font-script text-6xl leading-none text-primary sm:text-7xl">
                Love, Emmanuel
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* MOMENTS / POLAROIDS */}
      <section id="moments" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-accent">
            Small keepsakes
          </p>
          <h2 className="mt-4 text-center font-display text-5xl sm:text-6xl">
            Our little moments
          </h2>
          <GoldDivider />

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6 mt-8">
            <Polaroid src={polaroid1} caption="a petal for you" rotate={-4} />
            <div className="sm:mt-10">
              <Polaroid src={polaroid2} caption="to us" rotate={2.5} />
            </div>
            <Polaroid src={polaroid3} caption="sealed with love" rotate={-2} />
          </div>
        </div>
      </section>

      {/* VOWS / PROMISES */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-accent">
            Quiet promises
          </p>
          <h2 className="mt-4 text-center font-display text-5xl sm:text-6xl">
            The things I promise you
          </h2>
          <GoldDivider />

          <div className="grid gap-8 sm:grid-cols-3 mt-8">
            {[
              {
                n: "I.",
                t: "To choose you",
                d: "Softly, on ordinary Tuesdays. Loudly, on the days that matter.",
              },
              {
                n: "II.",
                t: "To listen",
                d: "To your silences as carefully as to your words. Both are worth learning.",
              },
              {
                n: "III.",
                t: "To stay",
                d: "Through candlelight and cold light — a hand you can always find.",
              },
            ].map((v) => (
              <div key={v.n} className="glass-card rounded-3xl p-8 text-center">
                <p className="font-display text-4xl text-accent">{v.n}</p>
                <div className="gold-divider my-4 w-24 mx-auto" />
                <h3 className="font-display text-2xl">{v.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {v.d}
                </p>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* NOW PLAYING */}
      <section id="songs" className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-accent">
            A soundtrack for us
          </p>
          <h2 className="mt-4 text-center font-display text-5xl sm:text-6xl">
            Songs I hum when I miss you
          </h2>
          <GoldDivider />
          <NowPlaying />
        </div>
      </section>

      {/* WHY ARE YOU SO CUTE — SCRATCH */}
      <section id="cute" className="relative px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">
            An impossible question
          </p>
          <h2 className="mt-4 font-display text-5xl sm:text-6xl">
            Why are you so cute?
          </h2>
          <GoldDivider />
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            I have no answer. Only a hidden little something for you —
            <span className="font-script text-lg text-primary"> scratch </span>
            gently, and see.
          </p>
          <ScratchCard image={scratchReveal} hint="scratch me softly" />
          <p className="mt-6 font-script text-2xl text-primary">
            (there you are — my favorite reason)
          </p>
        </div>
      </section>




      {/* QUOTE */}
      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <svg
            width="42"
            height="42"
            viewBox="0 0 32 32"
            className="mx-auto text-accent"
            aria-hidden
          >
            <path
              d="M16 4c4 2 6 5 6 8 0 3-3 5-6 5s-6-2-6-5c0-3 2-6 6-8Zm0 12c5 0 9 3 9 8 0 3-4 6-9 6s-9-3-9-6c0-5 4-8 9-8Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-script text-4xl leading-snug text-primary mt-6 sm:text-5xl">
            "In all the world, there is no heart for me like yours."
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            — Beethoven, to his beloved
          </p>
        </div>
      </section>

      {/* FOOTER SIGNATURE */}
      <footer className="relative px-6 pb-20 pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <GoldDivider />
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            written for you
          </p>
          <p className="font-script text-5xl text-primary mt-3">
            Love, Emmanuel
          </p>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} — a keepsake, kept quietly.
          </p>
        </div>
      </footer>
    </main>
  );
}
