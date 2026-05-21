import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-700">{eyebrow}</p> : null}
        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
