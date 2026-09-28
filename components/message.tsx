import { RichText } from "./rich-text";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
};

export type Chip = { label: string; value: string };

export function formatTime(at: number) {
  return new Date(at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex animate-rise justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-fg px-4 py-2.5 text-[0.9375rem] leading-6 text-bg sm:max-w-[75%]">
          <p className="[overflow-wrap:anywhere] whitespace-pre-wrap">
            {msg.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex animate-rise">
      <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-border bg-raised px-4 py-3 text-[0.9375rem] leading-6 text-fg sm:max-w-[80%]">
        <RichText text={msg.content} />
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex animate-rise" aria-live="polite">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-raised px-4 py-4">
        <span className="sr-only">typing…</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="dot size-1.5 rounded-full bg-muted"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Tappable answers to the questions the assistant asks. */
export function Chips({
  options,
  onPick,
  disabled,
}: {
  options: Chip[];
  onPick: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex animate-rise flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          disabled={disabled}
          onClick={() => onPick(option.value)}
          className="inline-flex min-h-12 max-w-full items-center rounded-full border border-border px-4 py-2 text-left text-[0.875rem] text-fg transition-colors hover:border-border-strong hover:bg-raised disabled:opacity-40"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
