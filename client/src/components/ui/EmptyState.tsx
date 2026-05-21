import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
      <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
