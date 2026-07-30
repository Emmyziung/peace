"use client"

import { useEffect, useRef, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ListMusic,
  LoaderCircle,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react"
import heroImage from "@/assets/hero-roses.jpg"
import envelopeImage from "@/assets/Alaafia/envelope.png"
import momentTwo from "@/assets/Alaafia/IMG-20260609-WA0005(1).jpg"
import momentFive from "@/assets/Alaafia/IMG-20260628-WA0029.jpg"
import momentThree from "@/assets/Alaafia/IMG-20260718-WA0337(1).jpg"
import momentOne from "@/assets/Alaafia/IMG-20260712-WA0057.jpg"
import momentFour from "@/assets/Alaafia/IMG-20260712-WA0239.jpg"
import momentEight from "@/assets/Alaafia/IMG-20260717-WA0045.jpg"
import momentSix from "@/assets/Alaafia/IMG-20260712-WA0100.jpg"
import momentSeven from "@/assets/Alaafia/SaveClip.App_630125151_17871673716545040_3597398456704367818_n.jpg.webp"
import momentNine from "@/assets/Alaafia/IMG-20260718-WA0335(2).jpg"
import scratchReveal from "@/assets/Alaafia/Screenshot_20260625-221240.jpg"
import coverPhoto from "@/assets/Alaafia/cover_photo.jpg"
import shortQuestion from "@/assets/Alaafia/am_i_short.png"
import { MusicProvider, useMusic } from "@/components/site-music"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

const NAMES = [
  "Alaafia Mi",
  "My Love",
  "My Baby",
  "Ayomi",
  "My Darling",
 
  "Mon Cœur",
]

const POLAROID_STORIES: PolaroidSlide[][] = [
  [
    { src: momentOne, caption: "your smile makes everyday brighter" },
    { src: momentTwo, caption: "effortlessly elegant" },
    { src: momentThree, caption: "I could look into those eyes all day 🥹" },
  ],
  [
    { src: momentFour, caption: "😎" },
    { src: momentFive, caption: "my sweet baby" },
    { src: momentSix, caption: "Alaafia 🤭" },
  ],
  [
    { src: momentSeven, caption: "my love ❤️" },
    { src: momentEight, caption: "all these flowers, you still look the prettiest" },
    { src: momentNine, caption: "pookie 🤭" },
  ],
]

function createPetals() {
  let seed = 0x2f6e2b1
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }

  return Array.from({ length: 14 }, (_, key) => ({
    left: random() * 100,
    delay: random() * 12,
    duration: 14 + random() * 12,
    drift: (random() - 0.5) * 200,
    size: 14 + random() * 22,
    rot: random() * 360,
    hue: 340 + random() * 20,
    light: 70 + random() * 15,
    key,
  }))
}

const PETALS = createPetals()

function RotatingName() {
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState<"in" | "out">("in")

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("out"), 3400)
    const t2 = window.setTimeout(() => {
      setI((v) => (v + 1) % NAMES.length)
      setPhase("in")
    }, 4200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [i])

  return (
    <span className="block h-[1.15em] overflow-hidden">
      <span
        key={i + phase}
        className="inline-block whitespace-nowrap bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
        style={{
          animation:
            phase === "in"
              ? "name-in 900ms cubic-bezier(.2,.7,.2,1) both"
              : "name-out 750ms cubic-bezier(.4,.1,.6,1) both",
        }}
      >
        {NAMES[i]}
      </span>
    </span>
  )
}

function Petals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PETALS.map((p) => (
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
  )
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
  )
}

type PolaroidSlide = {
  src: StaticImageData
  caption: string
}

function Polaroid({
  slides,
  rotate,
  holdMs,
  fadeMs,
}: {
  slides: PolaroidSlide[]
  rotate: number
  holdMs: number
  fadeMs: number
}) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const shouldFadeInRef = useRef(false)
  const slide = slides[index]

  useEffect(() => {
    const fadeIn = shouldFadeInRef.current ? window.setTimeout(() => setVisible(true), 60) : undefined
    shouldFadeInRef.current = false
    const fadeOut = window.setTimeout(() => setVisible(false), holdMs)
    const changePhoto = window.setTimeout(() => {
      shouldFadeInRef.current = true
      setIndex((current) => (current + 1) % slides.length)
    }, holdMs + fadeMs)

    return () => {
      if (fadeIn) window.clearTimeout(fadeIn)
      window.clearTimeout(fadeOut)
      window.clearTimeout(changePhoto)
    }
  }, [fadeMs, holdMs, index, slides.length])

  return (
    <figure
      className="flex h-full flex-col bg-card p-3 shadow-[var(--shadow-petal)] transition-transform duration-500 hover:rotate-0 hover:-translate-y-2"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <Image
        src={slide.src}
        alt={slide.caption}
        sizes="(min-width: 640px) 30vw, 100vw"
        className="aspect-[4/5] w-full object-cover transition-all ease-in-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.025)",
          transitionDuration: `${fadeMs}ms`,
        }}
      />
      <figcaption
        className="mt-3 flex min-h-9 flex-1 items-center justify-center px-2 text-center font-script text-2xl text-primary transition-all ease-in-out dark:text-foreground"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(4px)",
          transitionDuration: `${Math.round(fadeMs * 0.8)}ms`,
        }}
      >
        {slide.caption}
      </figcaption>
    </figure>
  )
}

function VideoFeature({
  src,
  poster = coverPhoto,
  caption = "30 seconds of the prettiest smile",
}: {
  src: string
  poster?: StaticImageData
  caption?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      video.pause()
    }
  }

  return (
    <div className="relative mx-auto mt-10 w-full max-w-[440px]">
      <div
        className="relative w-full rounded-[2rem] p-[3px] shadow-[0_8px_30px_-8px_hsl(336_12%_16%_/_0.14)]"
        style={{ background: "var(--video-frame)" }}
      >
        <div className="rounded-[calc(2rem-3px)] border border-[var(--decorative-border)] bg-card/80 p-1.5">
          <div className="group relative aspect-video w-full overflow-hidden rounded-[calc(1.875rem-3px)] border border-accent/25 bg-foreground/10">
            <video
              ref={videoRef}
              src={src}
              poster={poster.src}
              disablePictureInPicture
              muted
              playsInline
              preload="metadata"
              aria-label={caption}
              onClick={togglePlayback}
              onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
              onDurationChange={(event) => setDuration(event.currentTarget.duration)}
              onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="h-full w-full object-cover"
            />

            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className={`absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/45 bg-foreground/45 text-white shadow-lg backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-foreground/60 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              {isPlaying ? <Pause className="size-5" fill="currentColor" /> : <Play className="ml-0.5 size-5" fill="currentColor" />}
            </button>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-4 pb-3 pt-8">
              <div className="flex items-center gap-3">
                <span className="min-w-8 text-right text-[10px] tabular-nums text-white/90">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={currentTime}
                  disabled={!duration}
                  onChange={(event) => {
                    const nextTime = Number(event.target.value)
                    if (videoRef.current) videoRef.current.currentTime = nextTime
                    setCurrentTime(nextTime)
                  }}
                  aria-label="Video progress"
                  className="video-seeker h-4 min-w-0 flex-1 cursor-pointer disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) ${progress}%, rgba(255,255,255,.35) ${progress}%)`,
                  }}
                />
                <span className="min-w-8 text-[10px] tabular-nums text-white/90">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[9px] uppercase tracking-[0.4em] text-muted-foreground sm:text-[11px]">30 seconds of the prettiest smile ever</p>
    </div>
  )
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00"
  const wholeSeconds = Math.floor(seconds)
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`
}

function YouTubeMusicLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#ff0033" />
      <circle cx="24" cy="24" r="14.5" fill="none" stroke="white" strokeWidth="2.5" />
      <path d="M20 16.8 32 24 20 31.2Z" fill="white" />
    </svg>
  )
}

function MarqueeTitle({ children }: { children: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) return

    const updateOverflow = () => {
      setOverflows(measure.offsetWidth > container.clientWidth + 1)
    }

    const observer = new ResizeObserver(updateOverflow)
    observer.observe(container)
    observer.observe(measure)
    const frame = window.requestAnimationFrame(updateOverflow)
    void document.fonts?.ready.then(updateOverflow)

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [children])

  return (
    <div ref={containerRef} className="relative mt-1 overflow-hidden">
      <span
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute invisible w-max whitespace-nowrap font-display text-xl sm:text-2xl"
      >
        {children}
      </span>
      {overflows ? (
        <span
          key={children}
          className="track-title-marquee flex w-max items-center gap-8 whitespace-nowrap font-display text-xl leading-tight sm:text-2xl"
        >
          <span>{children}</span>
          <span aria-hidden>{children}</span>
        </span>
      ) : (
        <span className="block truncate whitespace-nowrap font-display text-xl leading-tight sm:text-2xl">
          {children}
        </span>
      )}
    </div>
  )
}

function NowPlaying() {
  const [open, setOpen] = useState(false)
  const {
    error,
    isLoading,
    isPlaying,
    isReady,
    next,
    pause,
    play,
    playlist,
    playlistStatus,
    playlistUrl,
    prepare,
    previous,
    seekTo,
    selectTrack,
    track,
  } = useMusic()
  const progress = track.duration > 0 ? (track.currentTime / track.duration) * 100 : 0
  const openPlaylist = () => {
    setOpen(true)
    prepare()
  }

  useEffect(() => {
    if (!open) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [open])

  return (
    <>
      <div className="glass-card relative mx-auto max-w-xl rounded-3xl p-4 sm:p-8">
        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className="relative size-14 shrink-0 rounded-full border border-accent/40 shadow-[var(--shadow-petal)] sm:size-20"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(344 45% 70%) 0 22%, hsl(336 12% 16%) 23% 100%)",
              animation: isPlaying ? "spin 6s linear infinite" : undefined,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 80 80" className="absolute inset-0 size-full text-accent">
              <defs>
                <path
                  id="vinyl-inscription"
                  d="M 40,6 a 34,34 0 1,1 0,68 a 34,34 0 1,1 0,-68"
                />
              </defs>
              <text
                fill="currentColor"
                fontSize="6"
                fontWeight="600"
                letterSpacing=".8"
              >
                <textPath
                  href="#vinyl-inscription"
                  startOffset="0"
                  textLength="210"
                  lengthAdjust="spacing"
                >
                  EMMANUEL.ALAAFIA. EMMANUEL.ALAAFIA.
                </textPath>
              </text>
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[8px] uppercase tracking-[0.3em] text-accent sm:text-[10px] sm:tracking-[0.4em]">now playing · for you</p>
            <MarqueeTitle>{isLoading && !track.id ? "Loading our soundtrack…" : track.title}</MarqueeTitle>
            <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">{isLoading && !track.id ? "YouTube Music is preparing the playlist" : track.artist}</p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
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
            <span>{formatTime(track.currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
          <input
            aria-label="Music progress"
            type="range"
            min="0"
            max={track.duration || 0}
            step="1"
            value={track.currentTime}
            disabled={!isReady || isLoading || track.duration === 0}
            onChange={(event) => seekTo(Number(event.target.value))}
            className="mt-2 h-1 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
          />
        </div>

        <div className="relative mt-4 flex min-h-12 items-center justify-center sm:mt-5 sm:min-h-14">
          <button
            onClick={openPlaylist}
            className="absolute left-0 grid size-10 place-items-center text-muted-foreground transition hover:text-foreground"
            aria-label="Open playlist"
          >
            <ListMusic className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-5 sm:gap-6">
            <button
              onClick={previous}
              className="grid size-9 place-items-center text-foreground/80 transition hover:text-primary"
              aria-label="Previous"
            >
              <SkipBack className="size-5 sm:size-6" />
            </button>
            <button
              onClick={isPlaying ? pause : play}
              disabled={isLoading}
              className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-[var(--color-primary-hover)] disabled:cursor-wait disabled:opacity-80 sm:size-14"
              aria-label={isLoading ? "Loading music" : isPlaying ? "Pause music" : "Play music"}
            >
              {isLoading ? <LoaderCircle className="size-5 animate-spin sm:size-6" /> : isPlaying ? <Pause className="size-5 sm:size-6" /> : <Play className="size-5 pl-0.5 sm:size-6" />}
            </button>
            <button
              onClick={next}
              className="grid size-9 place-items-center text-foreground/80 transition hover:text-primary"
              aria-label="Next"
            >
              <SkipForward className="size-5 sm:size-6" />
            </button>
          </div>
          <Heart
            aria-hidden
            className="absolute right-2 size-4 text-primary sm:right-1 sm:size-5"
            fill="currentColor"
          />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="playlist-modal glass-card max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-hidden rounded-3xl p-4 sm:max-h-[calc(100dvh-2rem)] sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-accent">YouTube Music</p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl">Songs for you, my love</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {playlistStatus === "ready" ? `${playlist.length} tracks · a candlelit hour` : "Gathering our songs…"}
                </p>
              </div>
              <a
                href={playlistUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 rounded-full border border-accent/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition hover:bg-accent/10"
              >
                Open
                <span className="size-4 rounded-full shadow-sm">
                  <YouTubeMusicLogo />
                </span>
              </a>
            </div>

            <div className="gold-divider my-5" />

            <ol className="max-h-[55dvh] space-y-1 overflow-y-auto pr-1 sm:max-h-[50vh] sm:pr-2">
              {playlistStatus === "loading" && playlist.length === 0 && (
                <li className="flex items-center justify-center gap-2 px-3 py-8 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" /> Loading our soundtrack…
                </li>
              )}
              {playlistStatus === "idle" && (
                <li className="px-3 py-8 text-center text-sm text-muted-foreground">Preparing the playlist…</li>
              )}
              {playlistStatus === "error" && (
                <li className="px-3 py-8 text-center text-sm text-muted-foreground">We could not load the song list. You can still open it in YouTube Music.</li>
              )}
              {playlist.map((item, index) => {
                const active = index === track.index
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        selectTrack(index)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left transition hover:bg-muted sm:gap-4 sm:px-3 sm:py-3 ${active ? "bg-muted" : ""}`}
                    >
                      <span className="w-5 text-right font-display text-sm text-accent">{index + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-base leading-tight sm:text-lg">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.artist}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {item.duration ? formatTime(item.duration) : "—"}
                      </span>
                      {active && isPlaying && (
                        <span className="flex h-4 items-end gap-[2px]" aria-label="Currently playing">
                          <span className="w-[3px] animate-pulse bg-primary" style={{ height: "60%" }} />
                          <span className="w-[3px] animate-pulse bg-primary" style={{ height: "100%", animationDelay: ".15s" }} />
                          <span className="w-[3px] animate-pulse bg-primary" style={{ height: "40%", animationDelay: ".3s" }} />
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
            {error && <p className="mt-4 text-center text-xs text-muted-foreground">{error}</p>}
          </div>
        </div>
      )}
    </>
  )
}

function ScratchCard({
  image,
  hint = "scratch to reveal",
}: {
  image: StaticImageData
  hint?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const drawing = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const prepareScratchBrush = (ctx: CanvasRenderingContext2D) => {
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = 40
    }

    const paintCover = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const palette =
        resolvedTheme === "dark"
          ? {
              start: "#aa8144",
              light: "#d0aa65",
              rose: "#ad687c",
              end: "#80563b",
              text: "rgba(255, 240, 226, .78)",
            }
          : {
              start: "#e6c783",
              light: "#f4dea8",
              rose: "#dca7b6",
              end: "#d6aa67",
              text: "rgba(104, 63, 75, .58)",
            }
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, palette.start)
      grad.addColorStop(0.35, palette.light)
      grad.addColorStop(0.55, palette.rose)
      grad.addColorStop(1, palette.end)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      for (let n = 0; n < 220; n++) {
        ctx.fillStyle = `hsla(${40 + Math.random() * 20}, 80%, ${70 + Math.random() * 20}%, ${Math.random() * 0.35})`
        ctx.beginPath()
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.4, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = palette.text
      ctx.font = "italic 20px 'Cormorant Garamond', serif"
      ctx.textAlign = "center"
      ctx.fillText("♡  " + hint + "  ♡", width / 2, height / 2)
    }

    const resizeCanvas = (preserveScratch: boolean, force = false) => {
      const rect = wrap.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const nextWidth = Math.max(1, Math.round(rect.width * dpr))
      const nextHeight = Math.max(1, Math.round(rect.height * dpr))
      if (!force && canvas.width === nextWidth && canvas.height === nextHeight) return

      const snapshot = document.createElement("canvas")
      snapshot.width = 0
      snapshot.height = 0
      if (preserveScratch && canvas.width && canvas.height) {
        snapshot.width = canvas.width
        snapshot.height = canvas.height
        snapshot.getContext("2d")?.drawImage(canvas, 0, 0)
      }

      canvas.width = nextWidth
      canvas.height = nextHeight
      const ctx = canvas.getContext("2d")!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      if (snapshot.width && snapshot.height) {
        ctx.drawImage(
          snapshot,
          0,
          0,
          snapshot.width,
          snapshot.height,
          0,
          0,
          rect.width,
          rect.height,
        )
      } else {
        paintCover(ctx, rect.width, rect.height)
      }
      prepareScratchBrush(ctx)
    }

    resizeCanvas(false, true)
    const observer = new ResizeObserver(() => resizeCanvas(true))
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [hint, resolvedTheme])

  const pt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const { x, y } = pt(e)
    const ctx = canvasRef.current!.getContext("2d")!
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.1, y + 0.1)
    ctx.stroke()
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const { x, y } = pt(e)
    const ctx = canvasRef.current!.getContext("2d")!
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    const c = canvasRef.current!
    const ctx = c.getContext("2d")!
    const data = ctx.getImageData(0, 0, c.width, c.height).data
    let clear = 0
    for (let i = 3; i < data.length; i += 32) if (data[i] === 0) clear++
    if (clear / (data.length / 32) > 0.45) setRevealed(true)
  }

  useEffect(() => {
    if (!revealed) return
    const c = canvasRef.current
    if (!c) return
    c.style.transition = "opacity 700ms ease"
    c.style.opacity = "0"
  }, [revealed])

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-[var(--decorative-border)] bg-card shadow-[var(--shadow-soft)]"
    >
      <Image
        src={image}
        alt="a little surprise for you"
        fill
        sizes="(min-width: 448px) 448px, 100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
        className="absolute inset-0 h-full w-full touch-none cursor-grab active:cursor-grabbing"
      />
    </div>
  )
}

function LetterSection() {
  const [isOpen, setIsOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const triggerElement = triggerRef.current
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      triggerElement?.focus({ preventScroll: true })
    }
  }, [isOpen])

  return (
    <section id="letter" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-accent sm:text-xs">
          A letter, for you
        </p>
        <h2 className="mt-4 text-center font-display text-4xl lg:text-6xl">
          For your eyes only
        </h2>
        <GoldDivider />

        <div className="envelope-invitation">
          <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsOpen(true)}
              aria-haspopup="dialog"
              className="glass-card group w-full rounded-3xl p-2 text-center transition duration-500 ease-out hover:-translate-y-1 hover:scale-[1.015] hover:shadow-[0_24px_64px_-22px_hsl(344_45%_60%_/_0.38)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
            <span className="envelope-heart-card relative flex flex-col items-center overflow-hidden rounded-[calc(1.5rem+2px)] border border-accent/35 px-4 py-8 sm:px-10 sm:py-10">
              <span className="relative z-10 block w-full max-w-[300px] sm:max-w-[340px]">
                <Image
                  src={envelopeImage}
                  alt="A blush pink love letter envelope with a wax seal"
                  sizes="(min-width: 640px) 340px, 300px"
                  className="h-auto w-full drop-shadow-[0_16px_22px_hsl(336_12%_16%_/_0.15)]"
                />
              </span>
              <span className="relative z-10 mt-4 font-display text-lg text-primary transition-all duration-300 group-hover:tracking-wide group-hover:text-primary-hover sm:text-xl">
                Click to open
              </span>
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="letter-backdrop fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-[3px] sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="love-letter-title"
            className="letter-pop relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-hidden rounded-sm sm:rounded-lg sm:max-h-[calc(100dvh-4rem)]"
          >
            <div className="flex max-h-[calc(100dvh-2rem)] flex-col rounded-sm sm:rounded-lg border border-border bg-card shadow-[0_24px_80px_-20px_hsl(336_12%_16%_/_0.35)] sm:max-h-[calc(100dvh-4rem)]">
              <header className="mx-7 flex shrink-0 justify-end border-b-2 border-accent/40 py-3 sm:mx-14">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close love letter"
                  className="grid size-10 place-items-center rounded-full text-primary/70 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </header>

              <div className="min-h-0 overflow-y-auto overscroll-contain px-7 py-8 sm:px-14 sm:py-10">
                <p id="love-letter-title" className="font-script text-3xl text-primary sm:text-4xl">
                  Alaafia temi nikan,
                </p>
                <div className="mt-6 space-y-6 font-display text-lg leading-relaxed text-foreground/90 sm:text-xl">
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
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">
                    yours, always
                  </p>
                  <p className="mt-2 font-script text-3xl leading-none text-primary sm:text-4xl">
                    Love, Obafunmilola
                  </p>
                </div>
              </div>

              <footer
                aria-hidden
                className="mx-7 h-8 shrink-0 border-t-2 border-accent/40 sm:mx-14"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const QUIRKY_SLIDES = [
  "Few months ago you asked a very important question",
  "I don’t think I have given the answer you were looking for 😔",
  "You might not even remember. Let me remind you.",
  null,
  "I meannn, do I even stilll have to talk? The picture has done justice 😄",
] as const

function QuirkySlides() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const goToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const nextIndex = Math.max(0, Math.min(index, QUIRKY_SLIDES.length - 1))
    track.children[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    })
    setActiveSlide(nextIndex)
  }

  const updateActiveSlide = () => {
    const track = trackRef.current
    if (!track) return

    const trackCenter = track.scrollLeft + track.clientWidth / 2
    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    Array.from(track.children).forEach((slide, index) => {
      const element = slide as HTMLElement
      const slideCenter = element.offsetLeft + element.offsetWidth / 2
      const distance = Math.abs(trackCenter - slideCenter)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    setActiveSlide(nearestIndex)
  }

  return (
    <section className="relative px-4 py-28 sm:px-6" aria-labelledby="quirky-story-title">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-accent sm:text-xs">
          A tiny detour
        </p>
        <h2 id="quirky-story-title" className="mt-4 text-center font-display text-4xl lg:text-6xl">
          You asked, remember?
        </h2>
        <GoldDivider />

        <div className="relative mx-auto mt-8 max-w-2xl">
          <div
            ref={trackRef}
            onScroll={updateActiveSlide}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault()
                goToSlide(activeSlide - 1)
              }
              if (event.key === "ArrowRight") {
                event.preventDefault()
                goToSlide(activeSlide + 1)
              }
            }}
            tabIndex={0}
            aria-label="A five-slide story. Swipe or use the arrow keys to continue."
            className="quirky-slide-track flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-[2rem] px-[7%] py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-6 sm:px-[9%]"
          >
            {QUIRKY_SLIDES.map((copy, index) => (
              <article
                key={index}
                aria-label={`Slide ${index + 1} of ${QUIRKY_SLIDES.length}`}
                className="glass-card flex min-h-[360px] w-[86%] shrink-0 snap-center items-center justify-center overflow-hidden rounded-[2rem] p-8 text-center sm:min-h-[430px] sm:w-[82%] sm:p-12"
              >
                {copy ? (
                  <p className="max-w-md font-display text-3xl leading-snug text-foreground sm:text-4xl">
                    {copy}
                  </p>
                ) : (
                  <figure className="flex h-full w-full flex-col items-center justify-center">
                    <div className="relative aspect-square w-full max-w-[330px] overflow-hidden rounded-3xl border-4 border-card bg-muted shadow-[var(--shadow-petal)]">
                      <Image
                        src={shortQuestion}
                        alt="The important question from a few months ago"
                        fill
                        sizes="(min-width: 640px) 330px, 72vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="mt-5 font-script text-3xl leading-none" aria-label="playful face">
                      😝
                    </figcaption>
                  </figure>
                )}
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToSlide(activeSlide - 1)}
            disabled={activeSlide === 0}
            aria-label="Previous slide"
            className="absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-accent/30 bg-card/90 text-foreground shadow-[var(--shadow-petal)] backdrop-blur transition hover:-translate-x-0.5 hover:border-accent disabled:pointer-events-none disabled:opacity-30 sm:-left-3 sm:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => goToSlide(activeSlide + 1)}
            disabled={activeSlide === QUIRKY_SLIDES.length - 1}
            aria-label="Next slide"
            className="absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-accent/30 bg-card/90 text-foreground shadow-[var(--shadow-petal)] backdrop-blur transition hover:translate-x-0.5 hover:border-accent disabled:pointer-events-none disabled:opacity-30 sm:-right-3 sm:grid"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2" aria-label="Choose a slide">
          {QUIRKY_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "step" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === index ? "w-7 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
        <p className="mt-4 text-center text-[9px] uppercase tracking-[0.35em] text-muted-foreground sm:text-[10px]">
          swipe to continue
        </p>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <main className="home-theme relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-700 ease-in-out">
      <ThemeToggle />
      <Petals />

      <section className="relative isolate flex min-h-screen items-start justify-center px-6 pb-24 pt-4 sm:pt-6">
        <Image
          aria-hidden
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 dark:opacity-0"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "var(--hero-overlay)" }}
        />
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
          <p className="mx-auto max-w-md font-display text-lg leading-relaxed text-foreground/75 sm:text-xl">
            An attempt to give form to something words have not been able to
            fully hold. To capture the way I see you, the quiet beauty you carry, and the countless little things
            that make you, unmistakably you.
          </p>
          <VideoFeature src="/videos/our-little-moment.mp4" />
        </div>
      </section>

      <LetterSection />

      <section id="moments" className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-accent sm:text-xs">The woman i love</p>
          <h2 className="mt-4 text-center font-display text-4xl lg:text-6xl">The art of you</h2>
          <GoldDivider />

          <div className="mx-auto mt-8 grid gap-10 px-3 sm:grid-cols-3 sm:gap-6 sm:px-0">
            <Polaroid slides={POLAROID_STORIES[0]} rotate={-4} holdMs={9300} fadeMs={1575} />
            <div className="h-full sm:mt-10">
              <Polaroid slides={POLAROID_STORIES[1]} rotate={2.5} holdMs={11175} fadeMs={1875} />
            </div>
            <Polaroid slides={POLAROID_STORIES[2]} rotate={-2} holdMs={8325} fadeMs={1350} />
          </div>
        </div>
      </section>

      <section id="songs" className="relative px-6 py-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-[10px] uppercase tracking-[0.4em] text-accent sm:text-xs">A playlist I made</p>
          <h2 className="mt-4 text-center font-display text-4xl lg:text-6xl">Songs that remind me of you</h2>
          <GoldDivider />
          <NowPlaying />
        </div>
      </section>

      <QuirkySlides />

      <section id="cute" className="relative px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent sm:text-xs">I&apos;ve gotta ask</p>
          <h2 className="mt-4 font-display text-4xl lg:text-6xl">Why are you so cute?</h2>
          <GoldDivider />
        
          <ScratchCard image={scratchReveal} hint="scratch me softly" />
          <p className="mt-6 font-script text-2xl text-primary">I meannnnn</p>
        </div>
      </section>

      <section className="relative px-6 py-32">
        <div className="mx-auto max-w-3xl text-center">
          <svg width="42" height="42" viewBox="0 0 32 32" className="mx-auto text-accent" aria-hidden>
            <path
              d="M16 4c4 2 6 5 6 8 0 3-3 5-6 5s-6-2-6-5c0-3 2-6 6-8Zm0 12c5 0 9 3 9 8 0 3-4 6-9 6s-9-3-9-6c0-5 4-8 9-8Z"
              fill="currentColor"
            />
          </svg>
          <h2 className="mt-6 font-display text-4xl leading-tight text-primary sm:text-5xl">
            What I Mean When I Say I Love You
          </h2>
          <blockquote className="mt-8">
            <p className="font-display text-xl italic leading-relaxed text-foreground/80 sm:text-2xl">
              &ldquo;Love is patient, love is kind. It does not envy, it does not boast, it is not proud.
              It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no
              record of wrongs. Love does not delight in evil but rejoices with the truth. It always
              protects, always trusts, always hopes, always perseveres.&rdquo;
            </p>
            <cite className="mt-8 block text-xs not-italic uppercase tracking-[0.35em] text-muted-foreground">
              — 1 Corinthians 13:4–7
            </cite>
          </blockquote>
        </div>
      </section>

      <footer className="relative px-6 pb-20 pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <GoldDivider />
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">created for you</p>
          <p className="mt-3 font-script text-5xl text-primary">With all my love, Emmanuel</p>
          <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} </p>
        </div>
      </footer>
    </main>
  )
}

export default function Home() {
  return (
    <MusicProvider>
      <HomePage />
    </MusicProvider>
  )
}
