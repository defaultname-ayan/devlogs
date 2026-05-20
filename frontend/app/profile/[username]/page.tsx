import Link from "next/link";
import { Suspense } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnalyzeResponse {
  username: string;
  stats: {
    total_events: number;
    events_by_type: Record<string, number>;
    events_by_repo: Record<string, number>;
  };
  digest: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function getUserAnalysis(username: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/users/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username.trim() }),
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // body wasn't JSON – keep the default message
    }
    throw new Error(message);
  }

  return res.json() as Promise<AnalyzeResponse>;
}

// ─── Background chrome (shared with landing) ──────────────────────────────────

function BackgroundChrome() {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="fixed -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed -bottom-48 -right-48 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)",
        }}
      />
    </>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="flex items-center justify-between py-8 border-b border-green-950">
      <Link
        href="/"
        className="font-['Instrument_Serif'] text-xl text-[#e8f0e8] tracking-tight"
      >
        Dev<em className="italic text-green-400">Pulse</em>
      </Link>
      <Link
        href="/"
        className="font-mono text-[11px] tracking-wider text-green-900 hover:text-green-400 transition-colors"
      >
        ← back
      </Link>
    </nav>
  );
}

// ─── Error UI ─────────────────────────────────────────────────────────────────

function ErrorState({ message }: { message: string }) {
  return (
    <section className="py-28">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-6">
        error
      </p>
      <h1 className="font-['Instrument_Serif'] text-[clamp(40px,7vw,64px)] font-normal leading-none tracking-tight text-[#e8f0e8] mb-7">
        Something went
        <br />
        <em className="italic text-green-400">wrong</em>
      </h1>

      <div className="relative bg-[#080d08] border border-green-950 rounded-xl p-6 max-w-md mb-10 overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(74,222,128,0.25), transparent)",
          }}
        />
        <p className="font-mono text-xs text-green-400/80 leading-relaxed">
          {message}
        </p>
      </div>

      <Link
        href="/"
        className="inline-block font-mono text-xs tracking-wider bg-green-400 text-[#060a06] rounded-md px-6 py-3 hover:bg-green-300 active:scale-[0.98] transition-all"
      >
        Try another username →
      </Link>
    </section>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ num, label }: { num: number | string; label: string }) {
  return (
    <div className="bg-[#080d08] border border-green-950 rounded-xl p-6 hover:bg-[#0a100a] transition-colors">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-3">
        {label}
      </p>
      <p className="font-['Instrument_Serif'] text-[42px] leading-none text-green-400">
        {num}
      </p>
    </div>
  );
}

// ─── Table section ────────────────────────────────────────────────────────────

function TableSection({
  title,
  rows,
}: {
  title: string;
  rows: [string, number][];
}) {
  return (
    <section className="bg-[#080d08] border border-green-950 rounded-xl overflow-hidden">
      <div className="px-8 py-5 border-b border-green-950">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900">
          {title}
        </p>
      </div>
      <div className="divide-y divide-green-950">
        {rows.map(([key, count]) => (
          <div
            key={key}
            className="flex items-baseline justify-between px-8 py-4 hover:bg-[#0a100a] transition-colors"
          >
            <span className="font-serif text-sm text-[#7a9e7a] truncate mr-4 max-w-[75%]">
              {key}
            </span>
            <span className="font-['Instrument_Serif'] text-xl text-green-400 shrink-0">
              {count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Profile content ──────────────────────────────────────────────────────────

function ProfileContent({ data }: { data: AnalyzeResponse }) {
  const repoRows = Object.entries(data.stats.events_by_repo).sort(
    (a, b) => b[1] - a[1],
  ) as [string, number][];

  const typeRows = Object.entries(data.stats.events_by_type).sort(
    (a, b) => b[1] - a[1],
  ) as [string, number][];

  return (
    <>
      {/* Header */}
      <section className="py-20">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-6">
          GitHub activity digest
        </p>
        <h1 className="font-['Instrument_Serif'] text-[clamp(44px,8vw,72px)] font-normal leading-none tracking-tight text-[#e8f0e8] mb-4">
          {data.username}
        </h1>
        <p className="font-serif text-base text-[#4a6b4a]">
          AI-powered insights into recent GitHub activity.
        </p>
      </section>

      <div className="h-px bg-green-950 mb-12" />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-green-950 border border-green-950 rounded-xl overflow-hidden mb-12">
        {[
          { num: data.stats.total_events, label: "total events" },
          {
            num: Object.keys(data.stats.events_by_type).length,
            label: "event types",
          },
          {
            num: Object.keys(data.stats.events_by_repo).length,
            label: "repositories",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#080d08] hover:bg-[#0a100a] transition-colors p-8"
          >
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-3">
              {s.label}
            </p>
            <p className="font-['Instrument_Serif'] text-[42px] leading-none text-green-400">
              {s.num}
            </p>
          </div>
        ))}
      </div>

      {/* AI digest */}
      <section className="mb-12">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-green-900 mb-6">
          weekly digest · generated by claude
        </p>
        <div className="relative bg-[#080d08] border border-green-950 rounded-xl p-8 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(74,222,128,0.35), transparent)",
            }}
          />
          <p className="font-serif text-sm leading-[1.9] text-[#4a6b4a] whitespace-pre-line">
            {data.digest}
          </p>
        </div>
      </section>

      {/* Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
        <TableSection title="Events by type" rows={typeRows} />
        <TableSection title="Events by repository" rows={repoRows} />
      </div>
    </>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <section className="py-20 space-y-12 animate-pulse">
      <div>
        <div className="h-2 w-32 bg-green-950 rounded mb-6" />
        <div className="h-16 w-64 bg-green-950/60 rounded mb-4" />
        <div className="h-4 w-48 bg-green-950 rounded" />
      </div>
      <div className="h-px bg-green-950" />
      <div className="grid grid-cols-3 gap-px bg-green-950 border border-green-950 rounded-xl overflow-hidden">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-[#080d08] p-8">
            <div className="h-2 w-20 bg-green-950 rounded mb-4" />
            <div className="h-10 w-12 bg-green-950/60 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-[#080d08] border border-green-950 rounded-xl p-8 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-3 bg-green-950 rounded"
            style={{ width: `${85 - i * 8}%` }}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Page (async RSC) ─────────────────────────────────────────────────────────

async function ProfileData({ username }: { username: string }) {
  let data: AnalyzeResponse | null = null;
  let error: string | null = null;

  try {
    data = await getUserAnalysis(username);
  } catch (err) {
    error = err instanceof Error ? err.message : "Something went wrong.";
  }

  if (error) return <ErrorState message={error} />;
  if (!data) return null;
  return <ProfileContent data={data} />;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  return (
    <main className="relative min-h-screen bg-[#060a06] text-[#c8d9c8] overflow-x-hidden font-serif">
      <BackgroundChrome />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <Nav />

        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileData username={decodedUsername} />
        </Suspense>

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
