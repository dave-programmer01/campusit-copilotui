"use client";

import { BeeAvatar } from "./bee";
import {
  BuildingIcon,
  CheckIcon,
  ChevronDownIcon,
  ExternalIcon,
  PinIcon,
  XIcon,
} from "./icons";
import { formatTime } from "./message";

export const LEHMANQ_URL = "https://www.lehman.edu/q";
export const DIRECTIONS_URL =
  "https://maps.google.com/?q=Carman+Hall+Lehman+College+Bronx+NY";

/** The quick-action prompt that sits above the composer. */
export function DeflectionBar({
  onAnswer,
  busy,
}: {
  onAnswer: (resolved: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-success/20 bg-surface/95 px-3.5 py-2.5 backdrop-blur-md shadow-lg sm:rounded-full">
      <span className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-off-white/90">
        <span className="size-2 rounded-full bg-lehman-bright" />
        did this fix your issue?
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => onAnswer(true)}
          className="btn-primary flex min-h-9 items-center justify-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-semibold text-white active:scale-95 disabled:opacity-50"
        >
          <CheckIcon className="size-3.5" />
          yes, sorted
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onAnswer(false)}
          className="flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-line-soft bg-surface-2 px-3.5 text-[0.8125rem] font-medium text-off-white transition-colors hover:border-success/40 active:scale-95 disabled:opacity-50"
        >
          <XIcon className="size-3.5" />
          still stuck
        </button>
      </div>
    </div>
  );
}

/** The full feedback card shown in the chat stream. */
export function DeflectionCard({
  onAnswer,
  busy,
}: {
  onAnswer: (resolved: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className="flex animate-rise items-start gap-2.5 sm:gap-3">
      <BeeAvatar className="mt-0.5 size-8.5 sm:size-9" />
      <div className="w-full max-w-[480px] rounded-[1.35rem] border border-line bg-deep/95 p-4.5 shadow-xl sm:p-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success animate-ping" />
          <h2 className="text-[1.1875rem] leading-6 font-semibold text-white">
            Did this fix it?
          </h2>
        </div>
        <p className="mt-1.5 text-[0.875rem] text-light-green">
          let me know if you&apos;re back up and running.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAnswer(true)}
            className="btn-primary flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-[0.875rem] font-semibold text-white active:scale-95 disabled:opacity-50 sm:text-[0.9375rem]"
          >
            <CheckIcon className="size-4" />
            Yes, sorted
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAnswer(false)}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-line-soft bg-surface-2 px-4 text-[0.875rem] font-semibold text-off-white transition-all duration-150 hover:border-success/40 hover:bg-surface active:scale-95 disabled:opacity-50 sm:text-[0.9375rem]"
          >
            <XIcon className="size-4" />
            Still stuck
          </button>
        </div>
      </div>
    </div>
  );
}

/** "Yes" confirmation celebration card. */
export function ResolvedCard({ at }: { at: number }) {
  return (
    <div className="flex animate-rise items-start gap-2.5 sm:gap-3">
      <div className="w-full max-w-[480px] rounded-[1.35rem] border border-success/30 bg-deep/95 p-4.5 shadow-xl sm:ml-11 sm:p-5">
        <div className="flex items-center gap-3">
          <BeeAvatar className="size-10" />
          <div>
            <p className="text-[1rem] leading-6 font-semibold text-white">
              logged — one less person in line 🎉
            </p>
            <p className="mt-0.5 text-[0.8125rem] text-light-green">
              glad it&apos;s working! you&apos;re all set.
            </p>
          </div>
        </div>
        {at > 0 && (
          <span className="mt-2 block text-right text-[0.6875rem] text-light-green/75">
            {formatTime(at)}
          </span>
        )}
      </div>
    </div>
  );
}

/** "Still stuck" fallback — inline human escalation. */
export function RealPersonCard() {
  return (
    <div className="flex animate-rise items-start gap-2.5 sm:gap-3">
      <div className="w-full max-w-[480px] rounded-[1.35rem] border border-line bg-deep/95 p-4.5 shadow-xl sm:ml-11 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-success/30 bg-success/15 text-success">
            <BuildingIcon className="size-5" />
          </span>
          <div>
            <h2 className="text-[1rem] font-semibold text-white">
              Need to talk to a real person?
            </h2>
            <p className="text-[0.8125rem] text-light-green">
              IT Help Desk is ready to assist.
            </p>
          </div>
        </div>

        <p className="mt-3 text-[0.875rem] leading-6 text-off-white/90">
          no worries! You can join the online queue at{" "}
          <span className="font-semibold text-lehman-bright">LehmanQ</span> or visit the walk-in desk at{" "}
          <span className="font-semibold text-white">Carman Hall 108</span>.
        </p>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={LEHMANQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-4 text-[0.875rem] font-semibold text-white active:scale-95"
          >
            Open LehmanQ
            <ExternalIcon className="size-4" />
          </a>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-success/40 bg-surface-2 px-4 text-[0.875rem] font-semibold text-off-white transition hover:bg-surface active:scale-95"
          >
            <PinIcon className="size-4" />
            Carman 108 Map
          </a>
        </div>

        <p className="mt-3.5 text-center text-[0.8125rem] text-light-green">
          you&apos;re not alone — we got you. 💚
        </p>
      </div>
    </div>
  );
}

/** Full-featured Mobile Bottom Sheet for Real Person Support */
export function RealPersonSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="animate-slide-up relative flex w-full max-w-[500px] flex-col rounded-t-[2rem] border-t border-line bg-[#0a1f1b] p-6 shadow-2xl sm:rounded-[2rem] sm:border">
        {/* Grab Handle for Mobile */}
        <div className="mx-auto -mt-2 mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-success/30 bg-success/15 text-success">
              <BuildingIcon className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Talk to a Real Person
              </h2>
              <p className="text-[0.8125rem] text-light-green">
                Lehman College IT Help Desk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-light-green transition hover:bg-white/10 hover:text-white"
          >
            <ChevronDownIcon className="size-5 sm:hidden" />
            <XIcon className="hidden size-5 sm:block" />
          </button>
        </div>

        <p className="mt-4 text-[0.9375rem] leading-6 text-off-white/90">
          Sometimes it&apos;s just easier to talk to a real person — and that&apos;s totally ok. You have two fast options:
        </p>

        <div className="mt-5 space-y-3">
          {/* LehmanQ option */}
          <a
            href={LEHMANQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl border border-line bg-surface-2/80 p-4 transition-all duration-200 hover:border-success/40 hover:bg-surface active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-xl bg-success/20 text-success">
                <ExternalIcon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-white">
                  LehmanQ <span className="text-xs text-lehman-bright font-normal">(Virtual Queue)</span>
                </p>
                <p className="text-xs text-light-green">Join line from your phone • lehman.edu/q</p>
              </div>
            </div>
            <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-lehman-bright">
              Open ↗
            </span>
          </a>

          {/* Carman Hall option */}
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl border border-line bg-surface-2/80 p-4 transition-all duration-200 hover:border-success/40 hover:bg-surface active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-10 place-items-center rounded-xl bg-success/20 text-success">
                <PinIcon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-white">
                  Carman Hall 108 <span className="text-xs text-light-green font-normal">(Walk-in Desk)</span>
                </p>
                <p className="text-xs text-light-green">In-person assistance on campus</p>
              </div>
            </div>
            <span className="rounded-full border border-line-soft bg-black/30 px-3 py-1 text-xs font-semibold text-off-white">
              Directions ↗
            </span>
          </a>
        </div>

        <div className="mt-6 rounded-2xl border border-success/20 bg-success/5 p-3.5 text-center">
          <p className="text-sm text-off-white/90">
            &ldquo;you&apos;re not alone — we got you.&rdquo; 💚
          </p>
          <p className="mt-1 text-xs text-light-green">
            Unofficial student-built co-pilot · Lehman College
          </p>
        </div>
      </div>
    </div>
  );
}
