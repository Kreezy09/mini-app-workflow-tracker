import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
};

export function FormField({ label, error, helper, children }: FormFieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {helper ? <span className="block text-xs text-slate-500">{helper}</span> : null}
      {error ? <span className="block text-sm font-medium text-rose-700">{error}</span> : null}
    </label>
  );
}
