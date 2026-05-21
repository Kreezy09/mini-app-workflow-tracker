import type { ReactNode } from "react";

type ActionPanelProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function ActionPanel({ title, description, children }: ActionPanelProps) {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-panel md:p-6">
      <h2 className="text-lg font-black tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      {children ? <div className="mt-5 grid gap-3">{children}</div> : null}
    </aside>
  );
}
