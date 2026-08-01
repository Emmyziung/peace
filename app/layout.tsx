import type { Metadata } from "next";
import "./globals.css";
import { Allura, Cormorant_Garamond, Manrope } from "next/font/google";
import { cn } from "@/lib/utils";

const allura = Allura({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-allura",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "My Peace My Love",
  description: "A private place made with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans",
        cormorantGaramond.variable,
        manrope.variable,
        allura.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
