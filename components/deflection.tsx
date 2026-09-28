"use client";

const LEHMANQ_URL = "https://www.lehman.edu/q";

export type DeflectionResult = "yes" | "no";

/**
 * The one deflection surface: a quiet row above the composer.
 *
 * It never inserts itself into the transcript and never fires on its own after
 * N turns. It sits there once a fix flow is underway, and the student taps it
 * when they have decided they are done. Once tapped it becomes a short
 * confirmation, so the same session cannot be recorded twice.
 */
export function DeflectionControl({
  result,
  busy,
  onAnswer,
}: {
  result: DeflectionResult | null;
  busy: boolean;
  onAnswer: (resolved: boolean) => void;
}) {
  if (result === "yes") {
    return (
      <p className="animate-rise text-[0.8125rem] text-muted">
        logged, glad it&apos;s sorted
      </p>
    );
  }

  if (result === "no") {
    return (
      <p className="animate-rise text-[0.8125rem] text-muted">
        no worries,{" "}
        <a
          href={LEHMANQ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg underline underline-offset-2 hover:text-accent"
        >
          lehman.edu/q
        </a>{" "}
        or Carman 108
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-subtle max-[359px]:hidden">
        did this fix it?
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAnswer(true)}
        className="inline-flex min-h-12 items-center px-1 text-[0.8125rem] text-muted underline-offset-4 transition-colors hover:text-fg hover:underline disabled:opacity-40"
      >
        fixed
      </button>
      <span aria-hidden="true" className="text-subtle">
        ·
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAnswer(false)}
        className="inline-flex min-h-12 items-center px-1 text-[0.8125rem] text-muted underline-offset-4 transition-colors hover:text-fg hover:underline disabled:opacity-40"
      >
        still stuck
      </button>
    </div>
  );
}
