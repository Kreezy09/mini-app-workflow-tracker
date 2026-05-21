import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../utils/classNames";

export function TextAreaInput({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-200/70",
        className
      )}
      {...props}
    />
  );
}
