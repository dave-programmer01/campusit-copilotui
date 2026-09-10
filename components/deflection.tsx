"use client";

import { CheckIcon, XIcon } from "./icons";

const LEHMANQ_URL = "https://www.lehman.edu/q";

export type DeflectionResult = "yes" | "no";

/**
 * The one deflection surface: a quiet strip above the composer.
 *
 * It never inserts itself into the transcript and never fires on its own after
 * N turns. It simply sits there once a conversation is underway, and the
 * student taps it when they have decided they are done. Once tapped it becomes
 * a short confirmation, so the same session cannot be recorded twice.
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
      <p className="animate-rise px-1 text-center text-[0.8125rem] text-light-green">
        logged, glad it&apos;s sorted 🎉
      </p>
    );
  }

  if (result === "no") {
    return (
      <p className="animate-rise px-1 text-center text-[0.8125rem] text-light-green">
        no worries,{" "}
        <a
          href={LEHMANQ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-success underline underline-offset-2"
        >
          LehmanQ at lehman.edu/q
        </a>{" "}
        or Carman 108
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 px-1">
      <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-light-green">
        did this fix it?
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAnswer(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-success/35 px-3.5 py-2 text-[0.8125rem] font-medium text-off-white transition hover:bg-success/10 disabled:opacity-40"
      >
        <CheckIcon className="size-3.5 text-success" />
        fixed
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAnswer(false)}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[0.8125rem] font-medium text-light-green transition hover:bg-white/5 disabled:opacity-40"
      >
        <XIcon className="size-3.5" />
        still stuck
      </button>
    </div>
  );
}
