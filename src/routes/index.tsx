import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, ArrowRight, Lock, Brain, Network, Activity } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinelAI — Explain. Detect. Defend." },
      { name: "description", content: "AI-powered URL intelligence: paste a link, get an explainable threat verdict with MITRE ATT&CK mapping." },
      { property: "og:title", content: "SentinelAI — URL Intelligence Engine" },
      { property: "og:description", content: "Explain. Detect. Defend. Explainable AI for URL threat analysis." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = url.trim();
    if (!v) return;
    setSubmitting(true);
    navigate({ to: "/analysis", search: { url: v } });
  };

  const samples = [
    "https://secure-login-update.bank-of-verify.tk/account",
    "http://192.168.1.45/admin/login",
    "https://github.com/openai",
  ];

  return (
    <AppShell>
      <div className="px-4 md:px-10 lg:px-16 py-10 lg:py-16 max-w-6xl mx-auto">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface)]/60 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground animate-fade-up">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--cyan)] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full size-1.5 bg-[color:var(--cyan)]" />
          </span>
          AI Engine Online · Model v4.2
        </div>

        {/* Hero */}
        <h1 className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] animate-fade-up" style={{ animationDelay: "60ms" }}>
          SentinelAI
          <span className="block bg-gradient-to-r from-[color:var(--cyan)] via-[color:var(--cyan-glow)] to-[color:var(--cyan)] bg-clip-text text-transparent">
            Explain. Detect. Defend.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: "120ms" }}>
          Paste a URL. Our explainable AI returns a calibrated threat score, the feature-level reasoning behind it,
          domain &amp; TLS telemetry, and the MITRE ATT&amp;CK techniques it most likely enables.
        </p>

        {/* URL form */}
        <form onSubmit={submit} className="mt-10 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <div className="glass-panel p-2 flex flex-col md:flex-row items-stretch gap-2 focus-within:glow-cyan transition">
            <div className="flex items-center pl-3 pr-1 text-muted-foreground">
              <Lock className="size-4 text-cyan" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/path?query=..."
              className="flex-1 bg-transparent outline-none px-2 py-3 text-base md:text-lg font-mono placeholder:text-muted-foreground/60"
              autoFocus
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={!url.trim() || submitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--cyan)] text-[color:var(--primary-foreground)] px-6 py-3 font-medium tracking-tight hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Analyzing…" : "Analyze"}
              <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground pt-1.5 pr-1">Try:</span>
            {samples.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setUrl(s)}
                className="text-xs font-mono px-2.5 py-1 rounded border border-border text-foreground/70 hover:text-cyan hover:border-[color:var(--cyan)]/40 transition"
              >
                {s.length > 48 ? s.slice(0, 48) + "…" : s}
              </button>
            ))}
          </div>
        </form>

        {/* Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Explainable AI", body: "Every verdict ships with the feature weights that produced it — not a black box." },
            { icon: Network, title: "Domain & TLS Telemetry", body: "WHOIS, passive DNS, ASN, certificate chain — gathered and joined in one view." },
            { icon: Activity, title: "MITRE ATT&CK Mapping", body: "Technique-level mapping with prioritized response actions for your SOC playbooks." },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-panel p-5 animate-fade-up" style={{ animationDelay: `${260 + i * 80}ms` }}>
                <Icon className="size-5 text-cyan" />
                <div className="mt-3 font-display font-semibold">{f.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>

        <footer className="mt-20 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="size-3 text-cyan" /> SentinelAI · URL Intelligence Engine
          </div>
          <div>Future modules: Email · Log · VPN · Server</div>
        </footer>
      </div>
    </AppShell>
  );
}
