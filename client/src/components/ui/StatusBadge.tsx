import type { ApplicationStatus } from "../../types/application";
import { cn } from "../../utils/classNames";
import { formatStatus } from "../../utils/format";

const statusClasses: Record<ApplicationStatus, string> = {
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  submitted: "bg-sky-100 text-sky-800 ring-sky-200",
  under_review: "bg-amber-100 text-amber-900 ring-amber-200",
  need_more_information: "bg-orange-100 text-orange-900 ring-orange-200",
  approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  rejected: "bg-rose-100 text-rose-800 ring-rose-200"
};

type StatusBadgeProps = {
  status: ApplicationStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ring-1",
        statusClasses[status]
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
