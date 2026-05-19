"use client";
import { useEffect, useState } from "react";

const ENDPOINTS = [
  { method: "POST", route: "/users/register", desc: "Track a GitHub username" },
  {
    method: "POST",
    route: "/users/{username}/sync",
    desc: "Trigger activity sync",
  },
  {
    method: "GET",
    route: "/users/{username}/activity",
    desc: "Query events with filters",
  },
  {
    method: "GET",
    route: "/users/{username}/stats",
    desc: "Aggregated commit / PR counts",
  },
  {
    method: "GET",
    route: "/users/{username}/digest",
    desc: "LLM-generated weekly summary",
  },
  { method: "GET", route: "/health", desc: "API status" },
];

const STACK = [
  "Python 3.11+",
  "FastAPI",
  "PostgreSQL",
  "SQLAlchemy 2.0",
  "Anthropic SDK",
  "APScheduler",
  "httpx",
  "Docker Compose",
];

const SAMPLE_STATS = [
  { label: "commits", value: 12 },
  { label: "PRs", value: 2 },
  { label: "repos", value: 3 },
];

function BlinkDot() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#4ade80",
        animation: "blink 2s ease-in-out infinite",
        flexShrink: 0,
      }}
    />
  );
}

function MethodBadge({ method }: { method: string }) {
  const isPost = method === "POST";
  return (
    <span
      style={{
        fontFamily: "'Martian Mono', monospace",
        fontSize: 10,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 4,
        background: isPost ? "rgba(74,222,128,0.12)" : "rgba(134,239,172,0.07)",
        color: isPost ? "#4ade80" : "#86efac",
        border: `0.5px solid ${isPost ? "rgba(74,222,128,0.3)" : "rgba(134,239,172,0.15)"}`,
        minWidth: 44,
        textAlign: "center" as const,
        display: "inline-block",
        letterSpacing: "0.04em",
      }}
    >
      {method}
    </span>
  );
}

export default function DevPulseLanding() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Martian+Mono:wght@300;400;500&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dp-root {
          min-height: 100vh;
          background: #060a06;
          color: #c8d9c8;
          font-family: 'Lora', Georgia, serif;
          position: relative;
          overflow-x: hidden;
        }

        .dp-grid-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .dp-glow {
          position: fixed;
          top: -120px;
          left: -120px;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .dp-container {
          max-width: 740px;
          margin: 0 auto;
          padding: 5.5rem 2rem 7rem;
          position: relative;
          z-index: 1;
        }

        .dp-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Martian Mono', monospace;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #4ade80;
          background: rgba(74,222,128,0.06);
          border: 0.5px solid rgba(74,222,128,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          margin-bottom: 2.5rem;
          animation: fadeUp 0.5s ease both;
        }

        .dp-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(48px, 8vw, 72px);
          font-weight: 400;
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          color: #e8f0e8;
          animation: fadeUp 0.5s 0.07s ease both;
        }

        .dp-title em {
          font-style: italic;
          color: #4ade80;
        }

        .dp-sub {
          font-family: 'Lora', Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.75;
          color: #5a7a5a;
          max-width: 500px;
          margin: 0 0 3rem;
          animation: fadeUp 0.5s 0.12s ease both;
        }

        .dp-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 5rem;
          flex-wrap: wrap;
          animation: fadeUp 0.5s 0.18s ease both;
        }

        .dp-btn-primary {
          font-family: 'Martian Mono', monospace;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.06em;
          background: #4ade80;
          color: #060a06;
          border: none;
          border-radius: 6px;
          padding: 12px 26px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }

        .dp-btn-primary:hover { background: #86efac; transform: translateY(-1px); }
        .dp-btn-primary:active { transform: translateY(0); }

        .dp-btn-ghost {
          font-family: 'Martian Mono', monospace;
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.06em;
          background: none;
          color: #3d5c3d;
          border: 0.5px solid #1a2e1a;
          border-radius: 6px;
          padding: 12px 22px;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          text-decoration: none;
        }

        .dp-btn-ghost:hover { color: #86efac; border-color: #2d4a2d; }

        .dp-divider {
          height: 0.5px;
          background: #0f1f0f;
          margin: 0 0 3.5rem;
        }

        .dp-label {
          font-family: 'Martian Mono', monospace;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #2d4a2d;
          margin: 0 0 1.5rem;
        }

        .dp-endpoints {
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-bottom: 4rem;
        }

        .dp-endpoint {
          display: grid;
          grid-template-columns: 62px 1fr auto;
          align-items: center;
          gap: 18px;
          padding: 11px 10px;
          border-radius: 6px;
          transition: background 0.15s;
          cursor: default;
        }

        .dp-endpoint:hover { background: rgba(74,222,128,0.03); }

        .dp-route {
          font-family: 'Martian Mono', monospace;
          font-size: 12px;
          font-weight: 300;
          color: #7a9e7a;
          letter-spacing: 0.01em;
        }

        .dp-route-desc {
          font-family: 'Lora', Georgia, serif;
          font-size: 13px;
          color: #2d4a2d;
          text-align: right;
          font-style: italic;
        }

        .dp-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4rem;
        }

        .dp-chip {
          font-family: 'Martian Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: #3d5c3d;
          border: 0.5px solid #0f1f0f;
          border-radius: 100px;
          padding: 6px 16px;
          background: #080d08;
          letter-spacing: 0.03em;
          transition: color 0.15s, border-color 0.15s;
        }

        .dp-chip:hover { color: #86efac; border-color: #1a2e1a; }

        .dp-preview {
          background: #080d08;
          border: 0.5px solid #0f1f0f;
          border-radius: 10px;
          padding: 1.75rem 2rem;
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
        }

        .dp-preview::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent);
        }

        .dp-preview-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .dp-preview-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 16px;
          font-weight: 400;
          color: #c8d9c8;
          letter-spacing: 0.01em;
        }

        .dp-preview-date {
          font-family: 'Martian Mono', monospace;
          font-size: 10px;
          font-weight: 300;
          color: #2d4a2d;
          letter-spacing: 0.08em;
        }

        .dp-preview-body {
          font-family: 'Lora', Georgia, serif;
          font-size: 14px;
          line-height: 1.85;
          color: #4a6b4a;
          border-top: 0.5px solid #0f1f0f;
          padding-top: 1.25rem;
        }

        .dp-preview-body code {
          font-family: 'Martian Mono', monospace;
          font-size: 12px;
          color: #4ade80;
          background: rgba(74,222,128,0.08);
          padding: 1px 6px;
          border-radius: 3px;
        }

        .dp-preview-stats {
          display: flex;
          gap: 2rem;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }

        .dp-stat {
          font-family: 'Martian Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: #2d4a2d;
          display: flex;
          align-items: baseline;
          gap: 6px;
          letter-spacing: 0.04em;
        }

        .dp-stat-num {
          font-size: 20px;
          font-weight: 400;
          color: #4ade80;
          font-family: 'Instrument Serif', Georgia, serif;
          line-height: 1;
        }

        .dp-footer {
          font-family: 'Martian Mono', monospace;
          font-size: 11px;
          font-weight: 300;
          color: #1a2e1a;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          align-items: center;
          letter-spacing: 0.05em;
        }

        .dp-footer a {
          color: #2d4a2d;
          text-decoration: none;
          transition: color 0.2s;
        }

        .dp-footer a:hover { color: #4ade80; }
      `}</style>

      <div className="dp-root">
        <div className="dp-grid-bg" aria-hidden="true" />
        <div className="dp-glow" aria-hidden="true" />

        <div className="dp-container">
          <h1 className="dp-title">
            Your GitHub,
            <br />
            <em>digested weekly</em>
          </h1>

          <p className="dp-sub">
            DevPulse syncs your public GitHub activity and uses Claude to write
            you a clean, readable weekly summary. Register a username, sync, and
            read your digest.
          </p>

          <div className="dp-actions">
            <a className="dp-btn-primary" href="/docs">
              Get started →
            </a>
            <a className="dp-btn-ghost" href="/docs">
              View API docs
            </a>
          </div>

          <div className="dp-divider" />

          <p className="dp-label">API endpoints</p>
          <div className="dp-endpoints">
            {ENDPOINTS.map((ep) => (
              <div className="dp-endpoint" key={ep.route}>
                <MethodBadge method={ep.method} />
                <span className="dp-route">{ep.route}</span>
                <span className="dp-route-desc">{ep.desc}</span>
              </div>
            ))}
          </div>

          <p className="dp-label">Tech stack</p>
          <div className="dp-stack">
            {STACK.map((s) => (
              <span className="dp-chip" key={s}>
                {s}
              </span>
            ))}
          </div>

          <p className="dp-label">Sample digest</p>
          <div className="dp-preview">
            <div className="dp-preview-header">
              <span className="dp-preview-title">
                Weekly digest · defaultname-ayan
              </span>
              <span className="dp-preview-date">week of may 12, 2026</span>
            </div>
            <div className="dp-preview-body">
              This week you made 12 commits across 3 repos, opened 2 PRs, and
              most activity concentrated on Wednesday. Your most active repo was{" "}
              <code>Memora</code>, with heavy focus on service worker keepalive
              and deduplication logic. One PR was merged, one remains open in
              review.
              <div className="dp-preview-stats">
                {SAMPLE_STATS.map((s) => (
                  <span className="dp-stat" key={s.label}>
                    <span className="dp-stat-num">{s.value}</span>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="dp-divider" />

          <div className="dp-footer">
            <a href="/docs#sync">how sync works</a>
            <a href="/docs#digest">llm digest logic</a>
            <a href="/docs#deploy">deploy to railway</a>
            <span style={{ marginLeft: "auto" }}>devpulse · 2026</span>
          </div>
        </div>
      </div>
    </>
  );
}
