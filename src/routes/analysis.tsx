import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle,
  Brain, Lock, Globe, Fingerprint, Crosshair, ListChecks, GaugeCircle, History, CheckCircle2, Circle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Panel } from "@/components/panel";
import { ThreatGauge } from "@/components/threat-gauge";
import { analyze, verdictMeta, type Verdict } from "@/lib/mock-analysis";

const searchSchema = z.object({ url: z.string().min(1) });

export const Route = createFileRoute("/analysis")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Analysis — SentinelAI" },
      { name: "description", content: "URL threat analysis dashboard with explainable AI, domain intelligence and MITRE ATT&CK mapping." },
    ],
  }),
  component: AnalysisPage,
});

const verdictIcon: Record<Verdict, typeof ShieldCheck> = {
  Safe: ShieldCheck,
  Suspicious: ShieldAlert,
  "High Risk": AlertTriangle,
  Malicious: ShieldX,
};

function AnalysisPage() {
  const { url } = Route.useSearch();
  const result = useMemo(() => analyze(url), [url]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Simulate inference timeline
  useEffect(() => {
    setProgress(0);
    setReady(false);
    const total = result.timeline.length;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setProgress(i);
      if (i >= total) {
        clearInterval(id);
        setTimeout(() => setReady(true), 280);
      }
    }, 220);
    return () => clearInterval(id);
  }, [url, result.timeline.length]);

  const vMeta = verdictMeta[result.verdict];
  const VIcon = verdictIcon[result.verdict];
  const verdictColor = vMeta.color;

  return (
    <AppShell>
      <div className="px-4 md:px-8 lg:px-10 py-6 max-w-[1400px] mx-auto">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="min-w-0">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan transition">
              <ArrowLeft className="size-3.5" /> New analysis
            </Link>
            <div className="mt-2 flex items-center gap-2 min-w-0">
              <Lock className="size-4 text-cyan shrink-0" />
              <code className="font-mono text-sm md:text-base text-foreground truncate">{result.url}</code>
            </div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Scanned {new Date(result.scannedAt).toUTCString()}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2.5 self-start md:self-auto px-4 py-2 rounded-md ring-1 transition`}
            style={{
              color: verdictColor,
              borderColor: verdictColor,
              boxShadow: `0 0 24px color-mix(in oklab, ${verdictColor} 25%, transparent)`,
            }}
          >
            <VIcon className="size-5" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">AI Verdict</div>
              <div className="font-display font-semibold tracking-tight">{vMeta.label}</div>
            </div>
          </div>
        </div>

        {/* Timeline (always visible, animates) */}
        <Panel title="Analysis Timeline" icon={<History className="size-4" />} meta={`${result.timeline.length} stages`} className="mb-6">
          <ol className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {result.timeline.map((t, i) => {
              const done = i < progress;
              const active = i === progress - 1 && !ready;
              return (
                <li key={t.step} className={`relative rounded-md border p-3 transition ${done ? "border-[color:var(--cyan)]/40 bg-[color:var(--cyan)]/5" : "border-border bg-white/[0.02]"}`}>
                  <div className="flex items-center gap-2">
                    {done ? (
                      <CheckCircle2 className="size-4 text-cyan" />
                    ) : (
                      <Circle className="size-4 text-muted-foreground" />
                    )}
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                      Step {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium leading-tight">{t.step}</div>
                  <div className="mt-1 text-[10px] font-mono text-muted-foreground">{t.ms}ms</div>
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[color:var(--cyan)] animate-pulse" />
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Threat score + confidence */}
          <Panel title="Overall Threat Score" icon={<GaugeCircle className="size-4" />} className="lg:col-span-4" delay={50}>
            <div className="flex flex-col items-center">
              <ThreatGauge value={result.threatScore} color={verdictColor} />
              <div className="mt-4 w-full">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground mb-1">
                  <span>AI Confidence</span><span>{result.confidence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[color:var(--cyan)] to-[color:var(--cyan-glow)] transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 w-full text-center">
                <div className="rounded-md border border-border p-2">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Verdict</div>
                  <div className="font-display font-semibold" style={{ color: verdictColor }}>{vMeta.label}</div>
                </div>
                <div className="rounded-md border border-border p-2">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Score</div>
                  <div className="font-display font-semibold tabular-nums">{result.threatScore}/100</div>
                </div>
              </div>
            </div>
          </Panel>

          {/* Explainable AI */}
          <Panel title="Explainable AI · Why this verdict" icon={<Brain className="size-4" />} className="lg:col-span-8" delay={100}>
            <ul className="space-y-2.5">
              {result.explanations.map((e) => {
                const pct = Math.min(100, e.weight * 4);
                return (
                  <li key={e.label} className="group">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-foreground/90">{e.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">+{e.weight}</span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--cyan)]/60 to-[color:var(--cyan)] transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{e.detail}</div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          {/* SSL/TLS */}
          <Panel title="SSL / TLS" icon={<Lock className="size-4" />} className="lg:col-span-4" delay={150}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="size-12 rounded-md grid place-items-center font-display text-xl font-bold"
                style={{
                  color: result.ssl.valid ? "var(--success)" : "var(--danger)",
                  background: `color-mix(in oklab, ${result.ssl.valid ? "var(--success)" : "var(--danger)"} 15%, transparent)`,
                }}
              >
                {result.ssl.grade}
              </div>
              <div>
                <div className="text-sm font-medium">{result.ssl.valid ? "Certificate valid" : "Certificate invalid"}</div>
                <div className="text-xs text-muted-foreground font-mono">{result.ssl.protocol}</div>
              </div>
            </div>
            <dl className="text-xs space-y-1.5 font-mono">
              <Row k="Issuer" v={result.ssl.issuer} />
              <Row k="Valid from" v={result.ssl.validFrom} />
              <Row k="Valid to" v={result.ssl.validTo} />
            </dl>
          </Panel>

          {/* Domain Intelligence */}
          <Panel title="Domain Intelligence" icon={<Globe className="size-4" />} className="lg:col-span-4" delay={200}>
            <dl className="text-xs space-y-1.5 font-mono">
              <Row k="Domain" v={result.domain.domain} />
              <Row k="Age" v={`${result.domain.ageDays} days`} />
              <Row k="Registrar" v={result.domain.registrar} />
              <Row k="TLD" v={`.${result.domain.tld}`} />
              <Row k="IP" v={result.domain.ip} />
              <Row k="Country" v={result.domain.country} />
              <Row k="ASN" v={result.domain.asn} />
            </dl>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">DNS records</div>
              <ul className="text-xs font-mono space-y-1">
                {result.domain.dns.map((r) => (
                  <li key={r.type + r.value} className="flex gap-2">
                    <span className="text-cyan w-8">{r.type}</span>
                    <span className="text-foreground/80 truncate">{r.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          {/* URL Feature Analysis */}
          <Panel title="URL Feature Analysis" icon={<Fingerprint className="size-4" />} className="lg:col-span-4" delay={250}>
            <ul className="space-y-1.5">
              {result.features.map((f) => (
                <li key={f.name} className="flex items-center justify-between text-xs py-1.5 border-b border-border/40 last:border-0">
                  <span className="text-foreground/80">{f.name}</span>
                  <span className="flex items-center gap-2 font-mono">
                    <span className="tabular-nums">{f.value}</span>
                    <RiskPill risk={f.risk} />
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* MITRE ATT&CK */}
          <Panel title="MITRE ATT&CK Mapping" icon={<Crosshair className="size-4" />} className="lg:col-span-7" delay={300}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {result.mitre.map((m) => (
                <div key={m.id} className="rounded-md border border-border bg-white/[0.02] p-3 hover:border-[color:var(--cyan)]/40 transition">
                  <div className="flex items-center justify-between">
                    <code className="text-[11px] font-mono text-cyan">{m.id}</code>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{m.tactic}</span>
                  </div>
                  <div className="mt-1 text-sm font-medium">{m.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground leading-relaxed">{m.rationale}</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Recommendations */}
          <Panel title="AI Recommendations" icon={<ListChecks className="size-4" />} className="lg:col-span-5" delay={350}>
            <ol className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-3 rounded-md border border-border bg-white/[0.02] p-3">
                  <span
                    className="text-[10px] font-mono uppercase tracking-[0.18em] px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      color: priorityColor(r.priority),
                      background: `color-mix(in oklab, ${priorityColor(r.priority)} 15%, transparent)`,
                    }}
                  >
                    {r.priority}
                  </span>
                  <span className="text-sm text-foreground/90">{r.action}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-foreground/90 truncate">{v}</dd>
    </div>
  );
}

function RiskPill({ risk }: { risk: "low" | "med" | "high" }) {
  const map = {
    low: { c: "var(--success)", t: "LOW" },
    med: { c: "var(--warn)", t: "MED" },
    high: { c: "var(--danger)", t: "HIGH" },
  } as const;
  const m = map[risk];
  return (
    <span
      className="text-[9px] font-mono px-1.5 py-0.5 rounded tracking-wider"
      style={{ color: m.c, background: `color-mix(in oklab, ${m.c} 15%, transparent)` }}
    >
      {m.t}
    </span>
  );
}

function priorityColor(p: string) {
  switch (p) {
    case "Critical": return "var(--danger)";
    case "High": return "var(--warn)";
    case "Medium": return "var(--cyan)";
    default: return "var(--muted-foreground)";
  }
}
