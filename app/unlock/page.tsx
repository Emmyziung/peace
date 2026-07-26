"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type UnlockResponse = {
  error?: string;
  success?: boolean;
};

export default function UnlockPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setError(data.error ?? "That is not our secret.");
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
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-[#c76a7d] uppercase">
          Just for us
        </p>
        <h1 className="mt-3 text-center font-heading text-4xl leading-none text-[#3d272c] sm:text-5xl">
          A little love note
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-center text-sm leading-6 text-[#805f66]">
          What&apos;s our secret?
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="passcode">
            What&apos;s our secret?
          </label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            autoComplete="current-password"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            placeholder="Our secret"
            required
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl border border-[#c76a7d]/25 bg-white/70 px-4 text-center text-sm text-[#3d272c] outline-none transition placeholder:text-[#aa858d] focus:border-[#c76a7d] focus:ring-4 focus:ring-[#c76a7d]/15 disabled:cursor-not-allowed disabled:opacity-60"
          />
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
            {isSubmitting ? "Unlocking…" : "Open our little world"}
          </button>
        </form>
      </section>
    </main>
  );
}
