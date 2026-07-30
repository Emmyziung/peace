"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

type UnlockResponse = {
  error?: string;
  success?: boolean;
};

export default function UnlockPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const passcodeRef = useRef<HTMLInputElement>(null);
  const savedSelectionRef = useRef<{ start: number; end: number } | null>(null);

  useEffect(() => {
    passcodeRef.current?.focus();
  }, []);

  useEffect(() => {
    const input = passcodeRef.current;
    const selection = savedSelectionRef.current;
    if (!input || !selection) return;

    input.focus();
    input.setSelectionRange(selection.start, selection.end);
    savedSelectionRef.current = null;
  }, [showPasscode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json()) as UnlockResponse;

      if (!response.ok || !data.success) {
        setError(data.error ?? "issshh... wrong password");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="absolute inset-0 -z-10 bg-[#fff9f7]" />
      <div className="absolute -top-20 -left-16 -z-10 h-64 w-64 rounded-full bg-[#f3d9da]/70 blur-3xl" />
      <div className="absolute -right-20 -bottom-16 -z-10 h-72 w-72 rounded-full bg-[#f8e8e8] blur-3xl" />

      <section className="w-full max-w-md rounded-[1.5rem] border border-[#c76a7d]/20 bg-white/70 p-7 shadow-[0_24px_70px_rgba(105,55,68,0.14)] backdrop-blur-xl sm:p-10">
        <h1 className="text-center font-heading text-4xl leading-none text-[#3d272c] sm:text-5xl">
          Something I made for you
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-6 text-[#805f66]">
          Say the magic words
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="passcode">
            Say the magic words
          </label>
          <div className="relative">
            <input
              ref={passcodeRef}
              id="passcode"
              name="passcode"
              type={showPasscode ? "text" : "password"}
              autoComplete="current-password"
              autoFocus
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              required
              disabled={isSubmitting}
              className="h-12 w-full caret-[#c76a7d] rounded-xl border border-[#c76a7d]/25 bg-white/70 px-12 text-center text-sm text-[#3d272c] outline-none transition focus:border-[#c76a7d] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => {
                const input = passcodeRef.current;
                if (input) {
                  savedSelectionRef.current = {
                    start: input.selectionStart ?? passcode.length,
                    end: input.selectionEnd ?? passcode.length,
                  };
                }
                setShowPasscode((visible) => !visible);
              }}
              aria-label={showPasscode ? "Hide password" : "Show password"}
              aria-pressed={showPasscode}
              className="absolute right-1 top-1 grid size-10 place-items-center rounded-lg text-[#805f66] transition hover:bg-[#c76a7d]/10 hover:text-[#c76a7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c76a7d]/40"
            >
              {showPasscode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {error ? (
            <p aria-live="polite" className="text-center text-sm text-[#b4233d]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-[#c76a7d] px-4 text-sm font-semibold text-[#fff9f7] shadow-[0_10px_22px_rgba(199,106,125,0.28)] transition hover:bg-[#ad5367] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#c76a7d]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                <span>Opening…</span>
              </span>
            ) : (
              "Open"
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
