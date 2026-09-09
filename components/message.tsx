import { BeeAvatar } from "./bee";
import { RichText } from "./rich-text";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
};

export function formatTime(at: number) {
  return new Date(at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Ticks() {
  return (
    <svg viewBox="0 0 20 12" className="size-3.5 text-lehman" aria-hidden="true">
      <path
        d="m1 6.6 3.2 3.2L10.4 3M8.2 9.8 14.4 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="flex animate-rise justify-end">
        <div className="max-w-[82%] rounded-bubble rounded-br-md bg-off-white px-4 py-2.5 text-[0.9375rem] leading-6 text-[#101c18] shadow-lg shadow-black/20 sm:max-w-[70%]">
          <p className="whitespace-pre-wrap">{msg.content}</p>
          {msg.at > 0 && (
            <span className="mt-0.5 flex items-center justify-end gap-1 text-[0.6875rem] text-[#5c6f68]">
              {formatTime(msg.at)}
              <Ticks />
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-rise items-start gap-2.5">
      <BeeAvatar className="mt-0.5 size-9" />
      <div className="max-w-[86%] rounded-bubble rounded-tl-md border border-line bg-deep px-4 py-3 text-[0.9375rem] leading-6 text-off-white shadow-lg shadow-black/20 sm:max-w-[78%]">
        <RichText text={msg.content} />
        {msg.at > 0 && (
          <span className="mt-1.5 block text-[0.6875rem] text-light-green">
            {formatTime(msg.at)}
          </span>
        )}
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex animate-rise items-center gap-2.5" aria-live="polite">
      <BeeAvatar className="size-9" />
      <div className="flex items-center gap-1.5 rounded-bubble rounded-tl-md border border-line bg-deep px-4 py-3.5">
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

/** Tappable suggestions under a reply (device pickers, "still stuck", …). */
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
    <div className="flex animate-rise flex-wrap gap-2 sm:pl-11.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onPick(option)}
          className="inline-flex min-h-12 items-center rounded-full border border-success/45 bg-success/5 px-5 text-[0.875rem] font-medium text-off-white transition hover:border-success hover:bg-success/15 disabled:opacity-40"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
