"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
const FEATURES = [
  {
    icon: "⟳",
    title: "Auto-synced, always fresh",
    body: "DevPulse polls GitHub every 6 hours. Your activity is always up to date — no manual triggers needed.",
  },
  {
    icon: "✦",
    title: "Claude writes your digest",
    body: "Every week, an LLM reads your raw commit and PR data and turns it into a human-readable summary you'd actually want to read.",
  },
  {
    icon: "↗",
    title: "Track any public profile",
    body: "Register any GitHub username. Great for following your own progress, or keeping tabs on a team.",
  },
  {
    icon: "◈",
    title: "Query your history",
    body: "Filter activity by repo, event type, or date range. Understand where your time actually went.",
  },
];

const STEPS = [
  { num: "01", label: "Register your GitHub username" },
  { num: "02", label: "DevPulse syncs your activity automatically" },
  { num: "03", label: "Read your weekly digest every Monday morning" },
];

const STATS = [
  { num: "12", label: "commits" },
  { num: "2", label: "pull requests" },
  { num: "3", label: "repos touched" },
];
export default function DevPulseLanding() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim()) setSubmitted(true);
    router.push(`/profile/${username.trim()}`);
  }
  return (
    <main className="relative min-h-screen bg-[#060a06] text-[#c8d9c8] overflow-x-hidden font-serif">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow top-left */}
      <div
        className="fixed -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Glow bottom-right */}
      <div
        className="fixed -bottom-48 -right-48 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* NAV */}
        <nav className="flex items-center justify-between py-8 border-b border-green-950">
          <span className="font-['Instrument_Serif'] text-xl text-[#e8f0e8] tracking-tight">
            Dev<em className="italic text-green-400">Pulse</em>
          </span>
        </nav>

        {/* HERO */}
        <section className="py-28">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-6">
            GitHub activity digest
          </p>
          <h1 className="font-['Instrument_Serif'] text-[clamp(52px,9vw,80px)] font-normal leading-none tracking-tight text-[#e8f0e8] mb-7">
            Know what you
            <br />
            actually <em className="italic text-green-400">built</em> this week
          </h1>
          <p className="font-serif text-lg leading-relaxed text-[#5a7a5a] max-w-md mb-12">
            DevPulse watches your GitHub and delivers a clear, AI-written
            summary of your week — every Monday morning.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2.5 flex-wrap max-w-md"
            >
              <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-1 min-w-[200px] font-mono text-xs tracking-wide bg-[#080d08] text-[#c8d9c8] border border-green-950 rounded-md px-4 py-3 outline-none placeholder:text-green-900 focus:border-green-400/40 transition-colors"
              />
              <button
                type="submit"
                className="font-mono text-xs tracking-wider bg-green-400 text-[#060a06] rounded-md px-6 py-3 whitespace-nowrap hover:bg-green-300 active:scale-[0.98] transition-all"
              >
                Try it now!
              </button>
            </form>
          ) : (
            <p className="font-serif italic text-green-400 text-base">
              You're on the list. We&apos;ll be in touch.
            </p>
          )}
          <p className="font-mono text-[10px] tracking-wider text-green-950 mt-3">
            free during early access · no credit card
          </p>
        </section>

        <div className="h-px bg-green-950 mb-20" />

        {/* FEATURES */}
        <section className="mb-24">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-10">
            What DevPulse does
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-green-950 border border-green-950 rounded-xl overflow-hidden">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-[#080d08] hover:bg-[#0a100a] transition-colors p-8"
              >
                <span className="font-mono text-green-400 text-lg block mb-4">
                  {f.icon}
                </span>
                <h3 className="font-['Instrument_Serif'] text-[19px] text-[#c8d9c8] mb-2 leading-snug">
                  {f.title}
                </h3>
                <p className="font-serif text-sm leading-relaxed text-[#4a6b4a]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-24">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-10">
            How it works
          </p>
          <div className="flex flex-col">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className={`grid grid-cols-[60px_1fr] gap-6 py-6 border-b border-green-950 ${i === 0 ? "border-t border-green-950" : ""}`}
              >
                <span className="font-['Instrument_Serif'] text-3xl text-green-950 leading-none pt-1">
                  {s.num}
                </span>
                <span className="font-serif text-[17px] text-[#7a9e7a] leading-snug pt-1.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* DIGEST PREVIEW */}
        <section className="mb-24">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-10">
            A real digest, looked like this
          </p>
          <div className="relative bg-[#080d08] border border-green-950 rounded-xl p-8 overflow-hidden">
            {/* top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(74,222,128,0.35), transparent)",
              }}
            />

            <p className="font-mono text-[10px] tracking-widest uppercase text-green-900 mb-5">
              weekly digest · generated by claude
            </p>
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
              <span className="font-['Instrument_Serif'] text-[17px] text-[#c8d9c8]">
                defaultname-ayan
              </span>
              <span className="font-mono text-[10px] tracking-wider text-green-900">
                week of may 12, 2026
              </span>
            </div>

            <div className="border-t border-green-950 pt-5 font-serif text-sm leading-[1.9] text-[#4a6b4a]">
              This week you made 12 commits across 3 repos, opening 2 PRs and
              merging one. Most of your activity landed on Wednesday. Your most
              active repo was{" "}
              <code className="font-mono text-xs text-green-400 bg-green-400/[0.08] px-1.5 py-px rounded">
                Memora
              </code>
              , with sustained focus on service worker keepalive and
              deduplication logic — a meaningful chunk of deep work for a single
              week. One PR remains open and in review.
              <div className="flex gap-8 flex-wrap mt-6 pt-5 border-t border-green-950">
                {STATS.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <span className="font-['Instrument_Serif'] text-[28px] text-green-400 leading-none">
                      {s.num}
                    </span>
                    <span className="font-mono text-[11px] tracking-wider text-green-900">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="border-t border-b border-green-950 py-12 mb-24">
          <p className="font-['Instrument_Serif'] italic text-[clamp(22px,4vw,30px)] text-[#7a9e7a] leading-snug max-w-xl mb-5">
            "I had no idea I spent three weeks almost entirely in one repo until
            DevPulse told me."
          </p>
          <span className="font-mono text-[11px] tracking-widest text-green-900">
            — a developer
          </span>
        </section>

        {/* FOOTER CTA */}
        <section className="text-center pb-28">
          <h2 className="font-['Instrument_Serif'] text-[clamp(36px,6vw,52px)] font-normal text-[#e8f0e8] leading-tight mb-4">
            Your week,
            <br />
            <em className="italic text-green-400">in plain English</em>
          </h2>
          <p className="font-serif text-[15px] text-[#4a6b4a] mb-10">
            Join the early access list. Free to start.
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2.5 justify-center flex-wrap max-w-sm mx-auto"
            >
              <input
                type="username"
                placeholder="yourusername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-1 min-w-[180px] font-mono text-xs tracking-wide bg-[#080d08] text-[#c8d9c8] border border-green-950 rounded-md px-4 py-3 outline-none placeholder:text-green-900 focus:border-green-400/40 transition-colors"
              />
              <button
                type="submit"
                className="font-mono text-xs tracking-wider bg-green-400 text-[#060a06] rounded-md px-6 py-3 whitespace-nowrap hover:bg-green-300 active:scale-[0.98] transition-all"
              >
                Join →
              </button>
            </form>
          ) : (
            <p className="font-serif italic text-green-400 text-base">
              You&apos;re on the list. We&apos;ll be in touch.
            </p>
          )}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-green-950 py-8 flex justify-between items-center flex-wrap gap-4">
          <span className="font-['Instrument_Serif'] text-[15px] text-green-900">
            Dev<em className="italic">Pulse</em>
          </span>
          <div className="flex gap-8 font-mono text-[11px] tracking-wider">
            <a
              href="/privacy"
              className="text-green-900 hover:text-green-400 transition-colors"
            >
              privacy
            </a>
            <a
              href="/api"
              className="text-green-900 hover:text-green-400 transition-colors"
            >
              api
            </a>
            <a
              href="https://github.com/defaultname-ayan"
              className="text-green-900 hover:text-green-400 transition-colors"
            >
              github
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
