"use client";

import { useState } from "react";
import { BeeAvatar } from "./bee";
import { CheckIcon, CopyIcon } from "./icons";
import { RichText } from "./rich-text";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
};

export function formatTime(at: number) {
  if (!at) return "";
  return new Date(at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Ticks() {
  return (
    <svg viewBox="0 0 20 12" className="size-3.5 text-lehman-bright" aria-hidden="true">
      <path
        d="m1 6.6 3.2 3.2L10.4 3M8.2 9.8 14.4 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isUser) {
    return (
      <div className="flex animate-rise justify-end">
        <div className="max-w-[85%] rounded-[1.35rem] rounded-tr-sm bg-off-white px-4 py-2.5 text-[0.9375rem] leading-6 text-[#0f241d] shadow-[0_4px_16px_rgba(0,0,0,0.25)] sm:max-w-[70%]">
          <p className="whitespace-pre-wrap font-normal">{msg.content}</p>
          {msg.at > 0 && (
            <span className="mt-1 flex items-center justify-end gap-1.5 text-[0.6875rem] font-medium text-[#4b6058]">
              {formatTime(msg.at)}
              <Ticks />
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-rise items-start gap-2.5 sm:gap-3">
      <BeeAvatar className="mt-0.5 size-8.5 sm:size-9" />
      <div className="group relative max-w-[88%] rounded-[1.35rem] rounded-tl-sm border border-line bg-deep/90 px-4 py-3.5 text-[0.9375rem] leading-6 text-off-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm sm:max-w-[80%]">
        <RichText text={msg.content} />

        <div className="mt-2.5 flex items-center justify-between border-t border-line-soft/40 pt-1.5 text-[0.6875rem] text-light-green">
          <span>{formatTime(msg.at)}</span>
          <button
            type="button"
            onClick={handleCopy}
            title="Copy message"
            aria-label="Copy message"
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-light-green/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            {copied ? (
              <>
                <CheckIcon className="size-3 text-success" />
                <span className="text-success">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex animate-rise items-center gap-2.5 sm:gap-3" aria-live="polite">
      <BeeAvatar className="size-8.5 sm:size-9" pulse />
      <div className="flex items-center gap-1.5 rounded-[1.25rem] rounded-tl-sm border border-line bg-deep px-4 py-3.5 shadow-md">
        <span className="sr-only">typing…</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="dot size-2 rounded-full bg-success"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Thumb-friendly mobile suggestions under a reply (devices, responses, etc.). */
export function Chips({
  options,
  onPick,
  disabled,
}: {
  options: string[];
  onPick: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex animate-rise flex-wrap gap-2 pl-10 sm:pl-12">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onPick(option)}
          className="inline-flex min-h-11 items-center rounded-full border border-success/40 bg-surface px-4.5 py-2 text-[0.875rem] font-medium text-off-white shadow-sm transition-all duration-150 hover:border-success hover:bg-success/15 active:scale-95 disabled:opacity-40"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
