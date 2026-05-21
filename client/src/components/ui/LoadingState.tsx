type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading applications..." }: LoadingStateProps) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-panel">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
      <p className="mt-4 text-sm font-semibold text-slate-600">{label}</p>
    </div>
  );
}
