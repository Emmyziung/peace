import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function UnlockLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
