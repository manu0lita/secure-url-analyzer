import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, Activity, Mail, ScrollText, Network, Server } from "lucide-react";

const modules = [
  { to: "/", label: "URL Intelligence", icon: Shield, enabled: true },
  { to: "#", label: "Email Intelligence", icon: Mail, enabled: false },
  { to: "#", label: "Log Intelligence", icon: ScrollText, enabled: false },
  { to: "#", label: "VPN Intelligence", icon: Network, enabled: false },
  { to: "#", label: "Server Intelligence", icon: Server, enabled: false },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-[color:var(--surface)]/60 backdrop-blur-md">
        <div className="px-5 py-5 border-b border-border flex items-center gap-2">
          <div className="size-8 rounded-md grid place-items-center bg-[color:var(--cyan)]/15 ring-1 ring-[color:var(--cyan)]/40">
            <Shield className="size-4 text-cyan" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold tracking-tight">SentinelAI</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">SOC Console</div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Modules</div>
          {modules.map((m) => {
            const Icon = m.icon;
            const active = m.enabled && pathname === m.to;
            return (
              <Link
                key={m.label}
                to={m.enabled ? m.to : "#"}
                className={`group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition
                  ${active ? "bg-[color:var(--cyan)]/10 text-cyan ring-1 ring-[color:var(--cyan)]/30" : "text-foreground/80 hover:bg-white/5"}
                  ${!m.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => { if (!m.enabled) e.preventDefault(); }}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4" />
                  {m.label}
                </span>
                {!m.enabled && <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Soon</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full size-2 bg-[color:var(--success)]" />
            </span>
            All systems nominal
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-[color:var(--background)]/60 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <Shield className="size-4 text-cyan" />
              <span className="font-display font-semibold">SentinelAI</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Activity className="size-3.5 text-cyan" />
              <span>SESSION-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
              <span className="text-border">/</span>
              <span>{new Date().toUTCString().slice(17, 25)} UTC</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            <span className="px-2 py-1 rounded border border-border">v1.0 · mock</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
