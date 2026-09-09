import { Fragment, type ReactNode } from "react";

type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: { marker: string; text: string }[] };

const ORDERED = /^\s*(\d{1,2})[.)]\s+(.*)$/;
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

/** Renders **bold** spans; everything else is plain text. */
function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function RichText({ text }: { text: string }) {
  const blocks = parse(text);

  // Precomputed per block: a line introducing a step list renders as the
  // design's card heading, and prose after a list renders as its callout.
  const firstList = blocks.findIndex((b) => b.kind === "list");
  const isHeading = (i: number) =>
    blocks[i + 1]?.kind === "list" &&
    (blocks[i] as { text: string }).text.trimEnd().endsWith(":");
  const isCallout = (i: number) => firstList !== -1 && i > firstList;

  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        if (block.kind === "list") {
          return (
            <ol key={i} className="space-y-2.5">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-px grid size-6 shrink-0 place-items-center rounded-full border border-success/40 bg-success/10 text-[12px] font-semibold text-success">
                    {item.marker}
                  </span>
                  <span className="min-w-0 flex-1 whitespace-pre-wrap">
                    {inline(item.text)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        if (isCallout(i)) {
          return (
            <p
              key={i}
              className="mt-3 rounded-2xl border border-line-soft bg-black/15 px-3.5 py-2.5 whitespace-pre-wrap text-off-white/90"
            >
              {inline(block.text)}
            </p>
          );
        }

        return (
          <p
            key={i}
            className={`whitespace-pre-wrap ${
              isHeading(i) ? "font-semibold text-white" : ""
            }`}
          >
            {inline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
