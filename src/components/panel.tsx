import type { ReactNode } from "react";

interface Props {
  title: string;
  icon?: ReactNode;
  meta?: ReactNode;
  className?: string;
  children: ReactNode;
  delay?: number;
}

export function Panel({ title, icon, meta, className = "", children, delay = 0 }: Props) {
  return (
    <section
      className={`glass-panel p-5 animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-cyan">{icon}</span>}
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/80">
            {title}
          </h3>
        </div>
        {meta && <div className="text-[10px] font-mono text-muted-foreground">{meta}</div>}
      </header>
      {children}
    </section>
  );
}
