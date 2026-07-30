"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

const PLAYLIST_ID = "PLEhNsL3CSrlI"
const PLAYLIST_URL = `https://music.youtube.com/playlist?list=${PLAYLIST_ID}`
const PREFERENCE_KEY = "elegant-whispers-music-preference"
const SESSION_KEY = "elegant-whispers-music-session"

type YouTubePlayer = {
  cuePlaylist: (options: {
    list: string
    listType: "playlist"
    index?: number
    startSeconds?: number
  }) => void
  playVideo: () => void
  pauseVideo: () => void
  nextVideo: () => void
  previousVideo: () => void
  playVideoAt: (index: number) => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlaylist: () => string[]
  getPlaylistIndex: () => number
  setLoop?: (loopPlaylists: boolean) => void
  getVideoData: () => { title?: string; author?: string; video_id?: string }
}

type YouTubePlayerEvent = { target: YouTubePlayer; data?: number }

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      height: string
      width: string
      playerVars: Record<string, number | string>
      events: {
        onReady: (event: YouTubePlayerEvent) => void
        onStateChange: (event: YouTubePlayerEvent) => void
        onError: () => void
      }
    },
  ) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

export type PlaylistTrack = {
  id: string
  title: string
  artist: string
  duration?: number
}

type Track = PlaylistTrack & {
  currentTime: number
  duration: number
  index: number
}

type PlaybackSession = {
  videoId: string
  index: number
  currentTime: number
  title: string
  artist: string
}

type MusicContextValue = {
  isPlaying: boolean
  isReady: boolean
  isLoading: boolean
  error: string | null
  track: Track
  playlist: PlaylistTrack[]
  playlistStatus: "idle" | "loading" | "ready" | "error"
  playlistUrl: string
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  previous: () => void
  seekTo: (seconds: number) => void
  selectTrack: (index: number) => void
  prepare: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)

  return new Promise<YouTubeNamespace>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-youtube-iframe-api="true"]')
    const previousReady = window.onYouTubeIframeAPIReady

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      if (window.YT) resolve(window.YT)
      else reject(new Error("YouTube player did not initialize."))
    }

    if (existingScript) return

    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    script.dataset.youtubeIframeApi = "true"
    script.onerror = () => reject(new Error("Unable to load the YouTube player."))
    document.head.appendChild(script)
  })
}

function savePreference(preference: "music" | "silent") {
  try {
    window.localStorage.setItem(PREFERENCE_KEY, preference)
  } catch {
    // Playback remains available even when browser storage is unavailable.
  }
}

function readSession(): PlaybackSession | null {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored) as Partial<PlaybackSession>
    if (
      typeof parsed.videoId !== "string" ||
      typeof parsed.index !== "number" ||
      typeof parsed.currentTime !== "number" ||
      typeof parsed.title !== "string" ||
      typeof parsed.artist !== "string"
    ) {
      return null
    }
    return parsed as PlaybackSession
  } catch {
    return null
  }
}

function saveSession(session: PlaybackSession) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // Resuming is an enhancement; storage is not required for playback.
  }
}

function MusicWelcome({ onMusic, onSilent }: { onMusic: () => void; onSilent: () => void }) {
  return (
    <div className="home-theme fixed inset-0 z-50 grid place-items-center bg-foreground/35 px-5 text-foreground backdrop-blur-sm">
      <section
        aria-labelledby="music-welcome-title"
        className="glass-card w-full max-w-md rounded-3xl p-8 text-center sm:p-10"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-accent">Before you continue</p>
        <h2 id="music-welcome-title" className="mt-3 font-display text-4xl sm:text-5xl">
          Continue with music?
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          You can control this any time in the player below.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onMusic}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:bg-[var(--color-primary-hover)]"
          >
            Play songs
          </button>
          <button
            type="button"
            onClick={onSilent}
            className="rounded-full border border-accent/50 px-6 py-3 text-sm font-medium text-foreground/80 transition hover:bg-accent/10"
          >
            No music
          </button>
        </div>
      </section>
    </div>
  )
}

function MusicResume({ session, onResume, onDismiss }: { session: PlaybackSession; onResume: () => void; onDismiss: () => void }) {
  return (
    <aside className="home-theme glass-card fixed inset-x-0 bottom-0 z-40 w-full p-4 text-foreground shadow-[var(--shadow-soft)] sm:bottom-5 sm:left-1/2 sm:w-[calc(100%-2.5rem)] sm:max-w-md sm:-translate-x-1/2 sm:rounded-3xl sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.35em] text-accent">Your soundtrack is waiting</p>
      <p className="mt-1 truncate font-display text-xl">{session.title}</p>
      <p className="truncate text-xs text-muted-foreground">{session.artist}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onResume}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-[var(--color-primary-hover)]"
        >
          Resume music
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-accent/50 px-4 py-2 text-xs font-medium text-foreground/80 transition hover:bg-accent/10"
        >
          Not now
        </button>
      </div>
    </aside>
  )
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const playerIsCreatingRef = useRef(false)
  const shouldPlayRef = useRef(false)
  const pendingPlaybackRef = useRef<{ index: number; time: number } | null>(null)
  const pendingSeekRef = useRef<number | null>(null)
  const preloadSessionRef = useRef<PlaybackSession | null>(null)
  const playlistIdsRef = useRef<string[]>([])
  const metadataRequestRef = useRef<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerState, setPlayerState] = useState<"idle" | "loading" | "buffering" | "error">("idle")
  const [preference, setPreference] = useState<"music" | "silent" | null | undefined>(undefined)
  const [resumeSession, setResumeSession] = useState<PlaybackSession | null>(null)
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([])
  const [playlistStatus, setPlaylistStatus] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [track, setTrack] = useState<Track>({
    id: "",
    title: "Your soundtrack is waiting",
    artist: "YouTube Music",
    currentTime: 0,
    duration: 0,
    index: 0,
  })

  const updateTrack = useCallback((player: YouTubePlayer) => {
    const data = player.getVideoData()
    const index = Math.max(player.getPlaylistIndex?.() ?? 0, 0)
    const id = data.video_id || playlistIdsRef.current[index] || ""
    setTrack((current) => {
      const knownTrack = playlist.find((item) => item.id === id)
      const nextTrack = {
        id,
        title: data.title || knownTrack?.title || current.title,
        artist: data.author || knownTrack?.artist || current.artist,
        currentTime: player.getCurrentTime() || 0,
        duration: player.getDuration() || knownTrack?.duration || 0,
        index,
      }
      if (nextTrack.id) {
        saveSession({
          videoId: nextTrack.id,
          index,
          currentTime: nextTrack.currentTime,
          title: nextTrack.title,
          artist: nextTrack.artist,
        })
      }
      return nextTrack
    })
  }, [playlist])

  const hydratePlaylist = useCallback(async (player: YouTubePlayer) => {
    const ids = player.getPlaylist?.().filter(Boolean) || []
    if (!ids.length) return

    playlistIdsRef.current = ids
    setPlaylist((current) =>
      ids.map((id, index) => current.find((item) => item.id === id) || {
        id,
        title: `Track ${index + 1}`,
        artist: "Loading details…",
      }),
    )

    const requestKey = ids.join(",")
    if (metadataRequestRef.current === requestKey) return
    metadataRequestRef.current = requestKey
    setPlaylistStatus("loading")

    try {
      const response = await fetch(`/api/music/metadata?ids=${encodeURIComponent(requestKey)}`)
      if (!response.ok) throw new Error("Unable to load the playlist details.")
      const result = (await response.json()) as { tracks?: PlaylistTrack[] }
      const tracksById = new Map((result.tracks || []).map((item) => [item.id, item]))
      setPlaylist(ids.map((id, index) => tracksById.get(id) || {
        id,
        title: `Track ${index + 1}`,
        artist: "YouTube Music",
      }))
      setPlaylistStatus("ready")
    } catch {
      setPlaylistStatus("error")
    }
  }, [])

  const createPlayer = useCallback(async () => {
    if (playerRef.current || playerIsCreatingRef.current || !mountRef.current) return

    playerIsCreatingRef.current = true
    setPlayerState("loading")
    try {
      const YT = await loadYouTubeApi()
      if (playerRef.current || !mountRef.current) return

      new YT.Player(mountRef.current, {
        height: "1",
        width: "1",
        playerVars: {
          autoplay: 0,
          controls: 0,
          enablejsapi: 1,
          list: PLAYLIST_ID,
          listType: "playlist",
          loop: 1,
          modestbranding: 1,
          origin: window.location.origin,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            playerIsCreatingRef.current = false
            playerRef.current = event.target
            event.target.setLoop?.(true)
            setIsReady(true)
            setPlayerState("idle")
            void hydratePlaylist(event.target)
            updateTrack(event.target)
            const pending = pendingPlaybackRef.current
            if (shouldPlayRef.current) {
              event.target.playVideoAt(pending?.index ?? 0)
            } else if (preloadSessionRef.current) {
              event.target.cuePlaylist({
                list: PLAYLIST_ID,
                listType: "playlist",
                index: preloadSessionRef.current.index,
                startSeconds: preloadSessionRef.current.currentTime,
              })
            }
          },
          onStateChange: (event) => {
            if (event.data === 3) setPlayerState("buffering")
            else if (event.data === 1) {
              setIsPlaying(true)
              setPlayerState("idle")
              if (pendingSeekRef.current !== null) {
                event.target.seekTo(pendingSeekRef.current, true)
                pendingSeekRef.current = null
                pendingPlaybackRef.current = null
              }
            } else if (event.data === 2 || event.data === 0) {
              setIsPlaying(false)
              setPlayerState("idle")
            }
            void hydratePlaylist(event.target)
            updateTrack(event.target)
          },
          onError: () => {
            playerIsCreatingRef.current = false
            setPlayerState("error")
            setIsPlaying(false)
          },
        },
      })
    } catch {
      playerIsCreatingRef.current = false
      setPlayerState("error")
      setIsPlaying(false)
    }
  }, [hydratePlaylist, updateTrack])

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = window.localStorage.getItem(PREFERENCE_KEY)
    } catch {}

    const savedPreference = saved === "music" || saved === "silent" ? saved : null
    const savedSession = readSession()
    preloadSessionRef.current = savedPreference === "music" ? savedSession : null
    const restorePreference = window.setTimeout(() => {
      setPreference(savedPreference)
      if (savedPreference === "music" && savedSession) {
        setResumeSession(savedSession)
        setTrack((current) => ({
          ...current,
          id: savedSession.videoId,
          index: savedSession.index,
          title: savedSession.title,
          artist: savedSession.artist,
          currentTime: savedSession.currentTime,
        }))
      }
    }, 0)
    return () => {
      window.clearTimeout(restorePreference)
    }
  }, [])

  useEffect(() => {
    // Build and cue the silent player during page startup so a later user
    // gesture only has to start playback, not initialize YouTube first.
    const preload = window.setTimeout(() => {
      void createPlayer()
    }, 0)
    return () => window.clearTimeout(preload)
  }, [createPlayer])

  useEffect(() => {
    if (!isPlaying || !playerRef.current) return
    const interval = window.setInterval(() => updateTrack(playerRef.current!), 1000)
    return () => window.clearInterval(interval)
  }, [isPlaying, updateTrack])

  const play = useCallback(() => {
    shouldPlayRef.current = true
    savePreference("music")
    setPreference("music")
    setResumeSession(null)
    if (playerRef.current) {
      setPlayerState("loading")
      playerRef.current.playVideo()
      return
    }
    void createPlayer()
  }, [createPlayer])

  const resume = useCallback(() => {
    if (resumeSession) {
      pendingPlaybackRef.current = { index: resumeSession.index, time: resumeSession.currentTime }
      pendingSeekRef.current = resumeSession.currentTime
    }
    play()
  }, [play, resumeSession])

  const pause = useCallback(() => {
    shouldPlayRef.current = false
    playerRef.current?.pauseVideo()
    setIsPlaying(false)
  }, [])

  const next = useCallback(() => {
    if (!playerRef.current) return
    shouldPlayRef.current = true
    setPlayerState("loading")
    playerRef.current.nextVideo()
  }, [])

  const previous = useCallback(() => {
    if (!playerRef.current) return
    shouldPlayRef.current = true
    setPlayerState("loading")
    playerRef.current.previousVideo()
  }, [])

  const selectTrack = useCallback((index: number) => {
    shouldPlayRef.current = true
    pendingPlaybackRef.current = { index, time: 0 }
    pendingSeekRef.current = null
    setPlayerState("loading")
    if (playerRef.current) {
      playerRef.current.playVideoAt(index)
      return
    }
    void createPlayer()
  }, [createPlayer])

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true)
    setTrack((current) => ({ ...current, currentTime: seconds }))
  }, [])

  const prepare = useCallback(() => {
    void createPlayer()
  }, [createPlayer])

  const value = useMemo<MusicContextValue>(
    () => ({
      isPlaying,
      isReady,
      isLoading: playerState === "loading" || playerState === "buffering",
      error: playerState === "error" ? "We could not load the soundtrack. Please try again." : null,
      track,
      playlist,
      playlistStatus,
      playlistUrl: PLAYLIST_URL,
      play,
      pause,
      toggle: isPlaying ? pause : play,
      next,
      previous,
      seekTo,
      selectTrack,
      prepare,
    }),
    [isPlaying, isReady, next, pause, play, playerState, playlist, playlistStatus, prepare, previous, seekTo, selectTrack, track],
  )

  return (
    <MusicContext.Provider value={value}>
      {children}
      <div ref={mountRef} aria-hidden className="pointer-events-none fixed -left-px -top-px h-px w-px overflow-hidden opacity-0" />
      {preference === null && <MusicWelcome onMusic={play} onSilent={() => { savePreference("silent"); setPreference("silent") }} />}
      {preference === "music" && resumeSession && <MusicResume session={resumeSession} onResume={resume} onDismiss={() => setResumeSession(null)} />}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) throw new Error("useMusic must be used within MusicProvider.")
  return context
}
