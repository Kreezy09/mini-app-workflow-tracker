type NoticeKind = "success" | "error";

const noticeClasses: Record<NoticeKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900"
};

type NoticeProps = {
  kind?: NoticeKind;
  message: string;
};

export function Notice({ kind = "success", message }: NoticeProps) {
  return <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${noticeClasses[kind]}`}>{message}</div>;
}
