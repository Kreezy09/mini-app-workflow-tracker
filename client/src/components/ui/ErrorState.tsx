import { Button } from "./Button";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-rose-950 shadow-panel">
      <h2 className="text-lg font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6">{message}</p>
      {onRetry ? (
        <Button className="mt-5" onClick={onRetry} variant="danger">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
