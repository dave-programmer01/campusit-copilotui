"use client";

import { BeeAvatar } from "./bee";
import {
  BuildingIcon,
  CheckIcon,
  ExternalIcon,
  PinIcon,
  XIcon,
} from "./icons";
import { formatTime } from "./message";

const LEHMANQ_URL = "https://www.lehman.edu/q";
const DIRECTIONS_URL =
  "https://maps.google.com/?q=Carman+Hall+Lehman+College+Bronx+NY";

/** The always-available prompt that sits above the composer. */
export function DeflectionBar({
  onAnswer,
  busy,
}: {
  onAnswer: (resolved: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-2 backdrop-blur">
      <span className="min-w-0 flex-1 truncate text-[13px] text-light-green">
        did this fix it?
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAnswer(true)}
        className="btn-primary flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
      >
        <CheckIcon className="size-3.5" />
        yes
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => onAnswer(false)}
        className="flex items-center gap-1.5 rounded-full border border-success/40 px-3 py-1.5 text-[12px] font-semibold text-off-white transition hover:bg-success/10 disabled:opacity-50"
      >
        <XIcon className="size-3.5" />
        still stuck
      </button>
    </div>
  );
}

/** The full card shown in the transcript once the walkthrough has run a while. */
export function DeflectionCard({
  onAnswer,
  busy,
}: {
  onAnswer: (resolved: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className="flex animate-rise items-start gap-2.5">
      <BeeAvatar className="mt-0.5 size-9" />
      <div className="w-full max-w-[520px] rounded-3xl border border-line bg-deep/80 p-5">
        <h2 className="text-[22px] leading-7 font-semibold text-white">
          Did this fix it?
        </h2>
        <p className="mt-1 text-[14px] text-light-green">
          let me know if you&apos;re back up and running.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAnswer(true)}
            className="btn-primary flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold text-white disabled:opacity-50"
          >
            <CheckIcon className="size-4.5" />
            Yes, sorted
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onAnswer(false)}
            className="flex items-center justify-center gap-2 rounded-full border border-success/45 px-4 py-3 text-[15px] font-semibold text-off-white transition hover:bg-success/10 disabled:opacity-50"
          >
            <XIcon className="size-4.5" />
            Still stuck
          </button>
        </div>
      </div>
    </div>
  );
}

/** "yes" confirmation — deliberately tiny and warm. */
export function ResolvedCard({ at }: { at: number }) {
  return (
    <div className="flex animate-rise items-start gap-2.5">
      <div className="w-full max-w-[520px] rounded-3xl border border-success/25 bg-deep px-4 py-4 sm:ml-11.5">
        <div className="flex items-center gap-3">
          <BeeAvatar className="size-11" />
          <p className="text-[16px] leading-6 font-semibold text-white">
            logged — one less person in line 🎉
          </p>
        </div>
        <p className="mt-2 text-[14px] text-light-green">
          glad it&apos;s working! you&apos;re all set.
        </p>
        <span className="mt-1.5 block text-right text-[11px] text-light-green">
          {formatTime(at)}
        </span>
      </div>
    </div>
  );
}

/** "still stuck" fallback — the human hand-off. */
export function RealPersonCard() {
  return (
    <div className="flex animate-rise items-start gap-2.5">
      <div className="w-full max-w-[520px] rounded-3xl border border-line bg-deep/80 p-5 sm:ml-11.5">
        <h2 className="text-[17px] font-semibold text-white">
          Need to talk to a real person?
        </h2>
        <div className="mt-3 flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-success/25 bg-success/10 text-success">
            <BuildingIcon className="size-6" />
          </span>
          <p className="text-[14px] leading-6 text-off-white/90">
            no worries — you can go to{" "}
            <span className="font-semibold text-success">LehmanQ</span> (online)
            or <span className="font-semibold text-white">Carman Hall 108</span>{" "}
            (in person).
          </p>
        </div>
        <div className="mt-4 grid gap-3">
          <a
            href={LEHMANQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold text-white"
          >
            Open LehmanQ
            <ExternalIcon className="size-4" />
          </a>
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-success/45 px-4 py-3 text-[15px] font-semibold text-off-white transition hover:bg-success/10"
          >
            <PinIcon className="size-4.5" />
            Directions to Carman 108
          </a>
        </div>
        <p className="mt-3 text-center text-[13px] text-light-green">
          you&apos;re not alone — we got you. 💚
        </p>
      </div>
    </div>
  );
}
