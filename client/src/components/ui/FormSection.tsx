import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-panel backdrop-blur md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}
