"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  const isDark = mounted && resolvedTheme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"
  const toggleTheme = () => {
    const updateTheme = () => setTheme(isDark ? "light" : "dark")
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!document.startViewTransition || reduceMotion) {
      updateTheme()
      return
    }

    document.startViewTransition(updateTheme)
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="glass-card fixed right-4 top-4 z-40 grid size-11 place-items-center rounded-full text-foreground transition hover:scale-105 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:right-6 sm:top-6"
    >
      {mounted ? (
        isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />
      ) : (
        <span className="size-5" aria-hidden />
      )}
    </button>
  )
}
