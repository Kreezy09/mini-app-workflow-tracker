import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "../../utils/classNames";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800",
  secondary: "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
  danger: "bg-rose-600 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-700",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm"
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ className, variant = "primary", size = "md", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      type={type}
      {...props}
    />
  );
}

export type ButtonLinkProps = {
  to: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function ButtonLink({ to, children, variant = "primary", size = "md", className }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      to={to}
    >
      {children}
    </Link>
  );
}
