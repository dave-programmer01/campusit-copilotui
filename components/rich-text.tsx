import { Fragment, type ReactNode } from "react";
import { CheckIcon } from "./icons";

type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: { marker: string; text: string }[] };

const ORDERED = /^\s*(\d{1,2})(?:[.)]\s*|\s+)(.*)$/;
const BULLET = /^\s*[-*•]\s+(.*)$/;

/** Splits an assistant reply into paragraphs and step lists. */
function parse(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];

  const flush = () => {
    if (para.length) {
      blocks.push({ kind: "p", text: para.join("\n") });
      para = [];
    }
  };

  for (const line of text.split("\n")) {
    const ordered = line.match(ORDERED);
    const bullet = line.match(BULLET);

    if (ordered || bullet) {
      flush();
      const item = ordered
        ? { marker: ordered[1], text: ordered[2] }
        : { marker: "•", text: bullet![1] };
      const last = blocks[blocks.length - 1];
      if (last?.kind === "list") last.items.push(item);
      else blocks.push({ kind: "list", items: [item] });
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }
    para.push(line);
  }
  flush();
  return blocks;
}

/** Parses markdown links, bold text, and inline code. */
function inline(text: string): ReactNode {
  // Pattern for links [text](url) or bold **text** or code `code`
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-md border border-line bg-black/40 px-1.5 py-0.5 font-mono text-[0.8125rem] text-success"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-lehman-bright underline decoration-success/50 underline-offset-2 hover:text-white"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function RichText({ text }: { text: string }) {
  const blocks = parse(text);

  // Precomputed per block: a line introducing a step list renders as the
  // design's card heading, and prose after a list renders as its callout.
  const firstList = blocks.findIndex((b) => b.kind === "list");
  const isHeading = (i: number) =>
    blocks[i + 1]?.kind === "list" &&
    (blocks[i] as { text: string }).text.trimEnd().endsWith(":");
  const isCallout = (i: number) => {
    if (firstList === -1 || i <= firstList) return false;
    const t = (blocks[i] as { text: string }).text.toLowerCase();
    return (
      t.includes("warning") ||
      t.includes("certificate") ||
      t.includes("note:") ||
      t.startsWith("if you get")
    );
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.kind === "list") {
          return (
            <ol key={i} className="my-2 space-y-2.5">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 rounded-xl border border-line-soft/60 bg-surface/50 p-2.5 transition-colors hover:bg-surface"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-success/50 bg-success/15 text-[0.75rem] font-bold text-success shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    {item.marker}
                  </span>
                  <span className="min-w-0 flex-1 text-[0.9375rem] leading-6 text-off-white/95">
                    {inline(item.text)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        if (isCallout(i)) {
          const isWarning =
            block.text.toLowerCase().includes("warning") ||
            block.text.toLowerCase().includes("certificate") ||
            block.text.toLowerCase().includes("note");

          return (
            <div
              key={i}
              className={`mt-3 flex items-start gap-2.5 rounded-2xl border p-3 text-[0.875rem] leading-6 ${
                isWarning
                  ? "border-success/30 bg-success/10 text-off-white"
                  : "border-line-soft bg-black/25 text-off-white/90"
              }`}
            >
              <CheckIcon className="mt-1 size-4 shrink-0 text-success" />
              <div className="min-w-0 flex-1">{inline(block.text)}</div>
            </div>
          );
        }

        return (
          <p
            key={i}
            className={`whitespace-pre-wrap text-[0.9375rem] leading-6 text-off-white/95 ${
              isHeading(i) ? "text-base font-semibold text-white" : ""
            }`}
          >
            {inline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
