import type { Metadata } from "next"
import ClientHome from "./client-home"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "My Darling — A Love Letter",
  description:
    "A romantic keepsake — soft petals, candlelight, and a letter written for you.",
}

export default function Page() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="love-letter-theme"
    >
      <ClientHome />
    </ThemeProvider>
  )
}
