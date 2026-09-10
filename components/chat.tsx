"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ApiError,
  RateLimitError,
  sendChat,
  sendDeflection,
} from "@/lib/api";
import { BeeAvatar } from "./bee";
import { DeflectionControl, type DeflectionResult } from "./deflection";
import {
  ClockIcon,
  MenuIcon,
  RefreshIcon,
  SendIcon,
  WifiIcon,
} from "./icons";
import { Chips, MessageBubble, TypingBubble, type Msg } from "./message";
import { Sidebar, type NavKey } from "./sidebar";

const STORAGE_KEY = "campusit.conversationId";

const GREETING: Msg = {
  id: "greeting",
  role: "assistant",
  content:
    "hey 👋 i'm your campus tech co-pilot, unofficial and student-built.\nwhat's giving you trouble? wifi, logging in, CUNYfirst, or email?",
  at: 0,
};

type Item =
  | { kind: "msg"; msg: Msg }
  | { kind: "about"; id: string };

type ErrState = { kind: "network" | "rate" | "config"; retryAfter?: number };

const SEEDS: Partial<Record<NavKey, { text: string; topic?: string }>> = {
  wifi: { text: "i can't get on the campus wifi", topic: "wifi" },
  login: { text: "i can't log in to my lehman account", topic: "login" },
  cunyfirst: { text: "i'm having trouble with CUNYfirst / my student email" },
};

const DEVICES = ["MacBook", "Windows", "iPhone", "Android"];

let seq = 0;
const nextId = () => `i${++seq}`;

/** Suggestions the design shows under a reply, derived from what was asked. */
function chipsFor(reply: string): string[] {
  const text = reply.toLowerCase();
  const asksDevice =
    text.includes("what device") ||
    (text.includes("macbook") && text.includes("windows"));
  if (asksDevice) {
    const picks = DEVICES.filter((d) => text.includes(d.toLowerCase()));
    return picks.length ? picks : DEVICES;
  }
  if (text.includes("let me know") || text.includes("does that work")) {
    return ["works now", "still stuck"];
  }
  return [];
}

export function Chat() {
  const [items, setItems] = useState<Item[]>([{ kind: "msg", msg: GREETING }]);
  // One id per session, reused on every turn — the backend keys all state on it.
  // sessionStorage can be unavailable in a sandboxed preview, so it degrades to
  // an id that lives only in React state.
  const [conversationId, setConversationId] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    } catch {}
    return crypto.randomUUID();
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ErrState | null>(null);
  const [draft, setDraft] = useState("");
  const [nav, setNav] = useState<NavKey>("home");
  const [drawer, setDrawer] = useState(false);
  const [deflectBusy, setDeflectBusy] = useState(false);
  const [deflectResult, setDeflectResult] = useState<DeflectionResult | null>(
    null,
  );
  const [topic, setTopic] = useState<string | undefined>();
  const [device, setDevice] = useState<string | undefined>();

  const lastSent = useRef<string>("");
  // State updates are batched, so three fast taps would all read the same stale
  // value and post three times. A ref flips synchronously on the first tap.
  const deflectLock = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, conversationId);
    } catch {}
  }, [conversationId]);

  const persistId = useCallback((id: string) => setConversationId(id), []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [items, pending, error]);

  // The chat fills the screen, so the document itself must never scroll. iOS
  // keeps the layout viewport at full height while the keyboard is open and
  // scrolls the page to reveal the focused composer, which would push the header
  // and transcript off screen and leave the composer stranded at the top.
  useEffect(() => {
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    const prevBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Belt and braces: if anything does scroll the page, put it straight back.
    const pin = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    window.addEventListener("scroll", pin, { passive: true });

    const vv = window.visualViewport;
    const apply = () => {
      // Bind the shell to the height actually on screen, so the composer sits
      // above the keyboard rather than behind it.
      if (vv) root.style.setProperty("--app-h", `${Math.round(vv.height)}px`);
      pin();
      // Safari can scroll again after its own resize; undo that too.
      requestAnimationFrame(pin);
    };

    apply();
    vv?.addEventListener("resize", apply);
    vv?.addEventListener("scroll", pin);
    return () => {
      vv?.removeEventListener("resize", apply);
      vv?.removeEventListener("scroll", pin);
      window.removeEventListener("scroll", pin);
      root.style.removeProperty("--app-h");
      root.style.overflow = prevRoot;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const push = useCallback((item: Item) => setItems((v) => [...v, item]), []);

  const deliver = useCallback(
    async (content: string, id: string) => {
      lastSent.current = content;
      setError(null);
      setPending(true);
      try {
        // Only the new message goes up; the backend owns the history.
        const res = await sendChat(id, content);
        persistId(res.conversationId);
        push({
          kind: "msg",
          msg: {
            id: nextId(),
            role: "assistant",
            content: res.reply,
            at: Date.now(),
          },
        });
      } catch (err) {
        if (err instanceof RateLimitError) {
          setError({ kind: "rate", retryAfter: err.retryAfter });
        } else if (err instanceof ApiError && err.message.includes("BASE_URL")) {
          setError({ kind: "config" });
        } else {
          setError({ kind: "network" });
        }
      } finally {
        setPending(false);
      }
    },
    [persistId, push],
  );

  const send = useCallback(
    (content: string) => {
      const text = content.trim();
      if (!text || pending || !conversationId) return;
      push({
        kind: "msg",
        msg: { id: nextId(), role: "user", content: text, at: Date.now() },
      });
      setDraft("");
      void deliver(text, conversationId);
    },
    [conversationId, deliver, pending, push],
  );

  const retry = useCallback(() => {
    if (!lastSent.current || !conversationId) return;
    void deliver(lastSent.current, conversationId);
  }, [conversationId, deliver]);

  const answerDeflection = useCallback(
    async (resolved: boolean) => {
      // Guard against a double tap recording the same session twice.
      if (!conversationId || deflectLock.current) return;
      deflectLock.current = true;
      setDeflectBusy(true);
      try {
        await sendDeflection({ conversationId, resolved, topic, device });
        setDeflectResult(resolved ? "yes" : "no");
      } catch {
        // Let them try again rather than losing the answer to a dropped request.
        deflectLock.current = false;
        setError({ kind: "network" });
      } finally {
        setDeflectBusy(false);
      }
    },
    [conversationId, device, topic],
  );

  const onNavigate = useCallback(
    (key: NavKey) => {
      setNav(key);
      setDrawer(false);

      if (key === "home") {
        const id = crypto.randomUUID();
        persistId(id);
        setItems([{ kind: "msg", msg: GREETING }]);
        setDeflectResult(null);
        deflectLock.current = false;
        setError(null);
        setTopic(undefined);
        setDevice(undefined);
        return;
      }
      if (key === "about") {
        push({ kind: "about", id: nextId() });
        return;
      }
      const seed = SEEDS[key];
      if (seed) {
        if (seed.topic) setTopic(seed.topic);
        send(seed.text);
      }
    },
    [persistId, push, send],
  );

  const onChip = useCallback(
    (value: string) => {
      if (DEVICES.includes(value)) setDevice(value.toLowerCase());
      send(value);
    },
    [send],
  );

  // Shown once a real conversation is underway, then for the rest of it.
  const hasUserSpoken = items.some(
    (i) => i.kind === "msg" && i.msg.role === "user",
  );

  const lastItem = items[items.length - 1];
  const chips =
    lastItem?.kind === "msg" &&
    lastItem.msg.role === "assistant" &&
    !pending
      ? chipsFor(lastItem.msg.content)
      : [];

  return (
    <div className="app-shell flex flex-col overflow-hidden bg-glow lg:flex-row">
      {/* Sidebar — permanent on desktop, drawer on mobile */}
      <aside className="hidden w-[16.5rem] shrink-0 border-r border-line bg-surface/60 lg:block">
        <Sidebar active={nav} onNavigate={onNavigate} />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85%] animate-rise border-r border-line bg-surface">
            <Sidebar active={nav} onNavigate={onNavigate} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b border-line bg-surface px-4 py-3">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            className="-ml-2 grid size-12 place-items-center rounded-xl text-off-white/80 transition hover:bg-white/5 lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>
          <BeeAvatar className="size-10" />
          <div className="min-w-0">
            <p className="flex items-center gap-2 truncate text-[0.9375rem] font-semibold text-white">
              CampusIT Co-Pilot
              <span className="size-1.5 shrink-0 rounded-full bg-success" />
            </p>
            <p className="truncate text-[0.75rem] text-light-green">
              unofficial · student-built
            </p>
          </div>
        </header>

        <main className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <div className="mx-auto flex max-w-[720px] flex-col gap-4">
            {items.map((item) => {
              switch (item.kind) {
                case "msg":
                  return <MessageBubble key={item.msg.id} msg={item.msg} />;
                case "about":
                  return <AboutCard key={item.id} />;
                default:
                  return null;
              }
            })}

            {pending && <TypingBubble />}

            {chips.length > 0 && (
              <Chips options={chips} onPick={onChip} disabled={pending} />
            )}

            {error && <ErrorCard error={error} onRetry={retry} />}

            <div ref={bottom} className="h-px" />
          </div>
        </main>

        <footer className="shrink-0 border-t border-line bg-surface px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-[720px] flex-col gap-2.5">
            {hasUserSpoken && (
              <DeflectionControl
                result={deflectResult}
                busy={deflectBusy}
                onAnswer={answerDeflection}
              />
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(draft);
                  }
                }}
                placeholder="Type your message..."
                aria-label="Message"
                className="scroll-thin max-h-32 min-h-12 flex-1 resize-none rounded-3xl border border-line bg-black/25 px-4 py-3 text-base leading-6 text-off-white placeholder:text-light-green/70 focus:border-success/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || pending}
                aria-label="Send"
                className="btn-primary grid size-12 shrink-0 place-items-center rounded-full text-white transition disabled:opacity-40"
              >
                <SendIcon className="size-5" />
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  );
}

function AboutCard() {
  return (
    <div className="flex animate-rise items-start gap-2.5">
      <BeeAvatar className="mt-0.5 size-9" />
      <div className="max-w-[520px] rounded-bubble rounded-tl-md border border-line bg-deep px-4 py-3.5 text-[0.9375rem] leading-6 text-off-white">
        <p className="font-semibold text-white">about this thing</p>
        <p className="mt-1.5 text-off-white/90">
          i&apos;m an <span className="font-semibold">unofficial, student-built</span>{" "}
          helper for Lehman College tech problems, not run by Lehman IT. i walk
          you through wifi, login, CUNYfirst and email fixes so you don&apos;t
          have to stand in line.
        </p>
        <p className="mt-2 text-light-green">
          for anything official (or if i strike out): LehmanQ at lehman.edu/q, or
          Carman Hall 108.
        </p>
      </div>
    </div>
  );
}

function ErrorCard({
  error,
  onRetry,
}: {
  error: ErrState;
  onRetry: () => void;
}) {
  if (error.kind === "config") {
    return (
      <div className="animate-rise rounded-2xl border border-error/40 bg-error/10 p-4 text-[0.875rem] text-off-white">
        <p className="font-semibold">not wired up yet</p>
        <p className="mt-1 text-off-white/85">
          set <code className="text-success">NEXT_PUBLIC_API_BASE_URL</code> to
          the backend URL and reload.
        </p>
      </div>
    );
  }

  const rate = error.kind === "rate";
  return (
    <div className="animate-rise max-w-[420px] rounded-2xl border border-line bg-surface-2/80 p-4">
      <div className="flex items-center gap-2.5 text-white">
        {rate ? (
          <ClockIcon className="size-5" />
        ) : (
          <WifiIcon className="size-5" />
        )}
        <p className="text-[0.9375rem] font-semibold">
          {rate ? "Rate limit" : "Connection error"}
        </p>
      </div>
      <p className="mt-2 text-[0.875rem] leading-6 text-light-green">
        {rate
          ? `one sec, too many messages. try again in ${
              error.retryAfter ? `${error.retryAfter}s` : "a moment"
            }.`
          : "my connection dropped. mind resending that?"}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-full border border-success/45 px-5 text-[0.875rem] font-medium text-off-white transition hover:bg-success/10"
      >
        <RefreshIcon className="size-4" />
        {rate ? "Try again" : "Retry"}
      </button>
    </div>
  );
}
