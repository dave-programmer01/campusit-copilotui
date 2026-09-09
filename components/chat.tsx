"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ApiError,
  RateLimitError,
  sendChat,
  sendDeflection,
} from "@/lib/api";
import { Bee, BeeAvatar } from "./bee";
import {
  DeflectionBar,
  DeflectionCard,
  RealPersonCard,
  RealPersonSheet,
  ResolvedCard,
} from "./deflection";
import {
  ClockIcon,
  LifeBuoyIcon,
  LockIcon,
  MailIcon,
  MenuIcon,
  PlusIcon,
  RefreshIcon,
  SendIcon,
  SparklesIcon,
  WifiIcon,
  XIcon,
} from "./icons";
import { Chips, MessageBubble, TypingBubble, type Msg } from "./message";
import { Sidebar, type NavKey } from "./sidebar";

const STORAGE_KEY = "campusit.conversationId";

const GREETING: Msg = {
  id: "greeting",
  role: "assistant",
  content:
    "hey  i'm your campus tech co-pilot, unofficial and student-built.\nwhat's giving you trouble? wifi, logging in, CUNYfirst, or email?",
  at: 0,
};

type Item =
  | { kind: "msg"; msg: Msg }
  | { kind: "deflect-ask"; id: string }
  | { kind: "deflect-yes"; id: string; at: number }
  | { kind: "deflect-no"; id: string; at: number }
  | { kind: "about"; id: string };

type ErrState = { kind: "network" | "rate" | "config"; retryAfter?: number };

const SEEDS: Partial<Record<NavKey, { text: string; topic?: string }>> = {
  wifi: { text: "i can't get on the campus wifi", topic: "wifi" },
  login: { text: "i can't log in to my lehman account", topic: "login" },
  cunyfirst: { text: "i'm having trouble with CUNYfirst / my student email" },
};

const COMMON_PROMPTS = [
  { label: " Fix Lehman Wi-Fi", text: "i can't connect to campus wifi (eduroam)" },
  { label: " Reset Password", text: "how do i reset my lehman login password?" },
  { label: " Student 365 Email", text: "i'm having trouble accessing my lehman student email" },
  { label: "CUNYfirst Help", text: "i can't access CUNYfirst" },
];

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
  const searchParams = useSearchParams();
  const [items, setItems] = useState<Item[]>([{ kind: "msg", msg: GREETING }]);
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
  const initialTopicParam = searchParams.get("topic") as NavKey | null;
  const hasValidSeed = initialTopicParam && SEEDS[initialTopicParam];

  const [nav, setNav] = useState<NavKey>(hasValidSeed ? initialTopicParam : "home");
  const [topic, setTopic] = useState<string | undefined>(
    hasValidSeed ? SEEDS[initialTopicParam]!.topic : undefined
  );
  const [drawer, setDrawer] = useState(false);
  const [realPersonSheet, setRealPersonSheet] = useState(false);
  const [showQuickPicker, setShowQuickPicker] = useState(false);
  const [deflectBusy, setDeflectBusy] = useState(false);
  const [composerFocused, setComposerFocused] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [device, setDevice] = useState<string | undefined>();

  const lastSent = useRef<string>("");
  const bottom = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initializedFromParams = useRef(false);

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

  // iOS / Android visualViewport handling for mobile keyboard
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--app-h", `${Math.round(vv.height)}px`);
    };
    apply();
    vv.addEventListener("resize", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      root.style.removeProperty("--app-h");
    };
  }, []);

  const push = useCallback((item: Item) => setItems((v) => [...v, item]), []);

  const deliver = useCallback(
    async (content: string, id: string) => {
      lastSent.current = content;
      setError(null);
      setPending(true);
      try {
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
      setShowQuickPicker(false);
      void deliver(text, conversationId);
    },
    [conversationId, deliver, pending, push],
  );

  // Auto-send initial seed if provided via URL parameter
  useEffect(() => {
    if (initializedFromParams.current) return;
    if (hasValidSeed) {
      initializedFromParams.current = true;
      const seedText = SEEDS[initialTopicParam]!.text;
      const timer = setTimeout(() => {
        send(seedText);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasValidSeed, initialTopicParam, send]);

  const retry = useCallback(() => {
    if (!lastSent.current || !conversationId) return;
    void deliver(lastSent.current, conversationId);
  }, [conversationId, deliver]);

  const answerDeflection = useCallback(
    async (resolved: boolean) => {
      if (!conversationId || deflectBusy) return;
      setDeflectBusy(true);
      try {
        await sendDeflection({ conversationId, resolved, topic, device });
        setAnswered(true);
        push(
          resolved
            ? { kind: "deflect-yes", id: nextId(), at: Date.now() }
            : { kind: "deflect-no", id: nextId(), at: Date.now() },
        );
      } catch {
        setError({ kind: "network" });
      } finally {
        setDeflectBusy(false);
      }
    },
    [conversationId, deflectBusy, device, push, topic],
  );

  const resetChat = useCallback(() => {
    const id = crypto.randomUUID();
    persistId(id);
    setItems([{ kind: "msg", msg: GREETING }]);
    setAnswered(false);
    setError(null);
    setTopic(undefined);
    setDevice(undefined);
    setNav("home");
  }, [persistId]);

  const onNavigate = useCallback(
    (key: NavKey) => {
      setNav(key);
      setDrawer(false);

      if (key === "home") {
        resetChat();
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
    [push, resetChat, send],
  );

  const onChip = useCallback(
    (value: string) => {
      if (DEVICES.includes(value)) setDevice(value.toLowerCase());
      send(value);
    },
    [send],
  );

  const assistantTurns = items.filter(
    (i) => i.kind === "msg" && i.msg.role === "assistant" && i.msg.id !== "greeting",
  ).length;
  const showCard = !answered && assistantTurns >= 3 && !pending;
  const showBar = !answered && assistantTurns >= 2 && !showCard && !composerFocused;

  const lastItem = items[items.length - 1];
  const chips =
    lastItem?.kind === "msg" &&
    lastItem.msg.role === "assistant" &&
    !pending &&
    !showCard
      ? chipsFor(lastItem.msg.content)
      : [];

  const isInitialState = items.length === 1 && items[0].kind === "msg" && items[0].msg.id === "greeting";

  return (
    <div className="app-shell flex flex-col overflow-hidden bg-glow lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[17.5rem] shrink-0 border-r border-line bg-surface/75 backdrop-blur-md lg:block">
        <Sidebar
          active={nav}
          onNavigate={onNavigate}
          onOpenRealPerson={() => setRealPersonSheet(true)}
        />
      </aside>

      {/* Mobile Navigation Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setDrawer(false)}
            aria-hidden="true"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
          />
          <div className="animate-slide-up fixed inset-y-0 left-0 w-[300px] max-w-[85%] border-r border-line bg-surface shadow-2xl">
            <Sidebar
              active={nav}
              onNavigate={onNavigate}
              onClose={() => setDrawer(false)}
              onOpenRealPerson={() => {
                setDrawer(false);
                setRealPersonSheet(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Real Person Bottom Sheet */}
      <RealPersonSheet
        isOpen={realPersonSheet}
        onClose={() => setRealPersonSheet(false)}
      />

      {/* Main Mobile App Container */}
      <div className="mx-auto flex h-full w-full max-w-[800px] min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile-First Header */}
        <header className="z-20 flex shrink-0 items-center justify-between border-b border-line bg-surface/90 px-3.5 py-3 backdrop-blur-md sm:px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="-ml-1.5 grid size-10 place-items-center rounded-xl text-off-white/80 transition hover:bg-white/10 active:scale-95 lg:hidden"
            >
              <MenuIcon className="size-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <BeeAvatar className="size-9" pulse />
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-[0.9375rem] font-bold leading-tight text-white">
                    CampusIT Co-Pilot
                  </h1>
                </div>
                <p className="flex items-center gap-1.5 text-[0.75rem] text-light-green">
                  <span className="size-1.5 rounded-full bg-success" />
                  online · Lehman College
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRealPersonSheet(true)}
              className="flex min-h-9 items-center gap-1.5 rounded-full border border-success/35 bg-success/10 px-3 py-1 text-xs font-semibold text-lehman-bright transition hover:bg-success/20 active:scale-95"
            >
              <LifeBuoyIcon className="size-3.5" />
              <span className="hidden xs:inline sm:inline">Human Help</span>
              <span className="xs:hidden sm:hidden">Help</span>
            </button>

            <button
              type="button"
              onClick={resetChat}
              title="New Chat"
              aria-label="New Chat"
              className="grid size-9 place-items-center rounded-full text-light-green transition hover:bg-white/10 hover:text-white active:scale-95"
            >
              <RefreshIcon className="size-4" />
            </button>
          </div>
        </header>

        {/* Sticky Horizontal Quick-Topics Strip for Mobile One-Tap Navigation */}
        <div className="z-10 shrink-0 border-b border-line-soft bg-[#071915]/80 px-3 py-2 backdrop-blur-sm">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => onNavigate("wifi")}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                nav === "wifi"
                  ? "bg-success/25 text-white border border-success/40"
                  : "border border-line bg-surface-2/60 text-off-white/80 hover:bg-surface-2"
              }`}
            >
              <WifiIcon className="size-3.5 text-lehman-bright" />
              Wi-Fi Help
            </button>

            <button
              type="button"
              onClick={() => onNavigate("login")}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                nav === "login"
                  ? "bg-success/25 text-white border border-success/40"
                  : "border border-line bg-surface-2/60 text-off-white/80 hover:bg-surface-2"
              }`}
            >
              <LockIcon className="size-3.5 text-lehman-bright" />
              Password Reset
            </button>

            <button
              type="button"
              onClick={() => onNavigate("cunyfirst")}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
                nav === "cunyfirst"
                  ? "bg-success/25 text-white border border-success/40"
                  : "border border-line bg-surface-2/60 text-off-white/80 hover:bg-surface-2"
              }`}
            >
              <MailIcon className="size-3.5 text-lehman-bright" />
              CUNYfirst / Email
            </button>

            <button
              type="button"
              onClick={() => setRealPersonSheet(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-off-white/80 transition hover:bg-surface-2 active:scale-95"
            >
              <span className="size-1.5 rounded-full bg-lehman-bright" />
              Carman 108
            </button>

            <button
              type="button"
              onClick={() => onNavigate("about")}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-light-green transition hover:bg-surface-2 active:scale-95"
            >
              About
            </button>
          </div>
        </div>

        {/* Chat Message Stream */}
        <main className="scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 sm:py-5">
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              switch (item.kind) {
                case "msg":
                  return <MessageBubble key={item.msg.id} msg={item.msg} />;
                case "deflect-yes":
                  return <ResolvedCard key={item.id} at={item.at} />;
                case "deflect-no":
                  return <RealPersonCard key={item.id} />;
                case "about":
                  return <AboutCard key={item.id} />;
                default:
                  return null;
              }
            })}

            {/* Interactive Welcome Card for new users */}
            {isInitialState && (
              <div className="animate-rise rounded-2xl border border-line bg-deep/60 p-4 backdrop-blur-sm sm:p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-light-green">
                  <SparklesIcon className="size-4 text-lehman-bright" />
                  Quick common fixes:
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {COMMON_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => send(p.text)}
                      className="flex min-h-11 items-center justify-between rounded-xl border border-line-soft bg-surface-2/80 px-3.5 py-2.5 text-left text-[0.875rem] font-medium text-off-white transition-all hover:border-success/40 hover:bg-surface active:scale-[0.98]"
                    >
                      <span>{p.label}</span>
                      <span className="text-xs text-lehman-bright">Ask ↗</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {pending && <TypingBubble />}

            {chips.length > 0 && (
              <Chips options={chips} onPick={onChip} disabled={pending} />
            )}

            {showCard && (
              <DeflectionCard onAnswer={answerDeflection} busy={deflectBusy} />
            )}

            {error && <ErrorCard error={error} onRetry={retry} />}

            <div ref={bottom} className="h-px" />
          </div>
        </main>

        {/* Quick Question / Device Drawer for Mobile */}
        {showQuickPicker && (
          <div className="animate-slide-up z-20 shrink-0 border-t border-line bg-surface-2 p-3 shadow-lg">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-light-green">
                Select your device or issue
              </span>
              <button
                type="button"
                onClick={() => setShowQuickPicker(false)}
                className="text-xs text-light-green hover:text-white"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEVICES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChip(d)}
                  className="rounded-full border border-success/35 bg-deep px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-success/20 active:scale-95"
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={() => send("i need help with lehman eduroam certificate")}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-off-white/90 hover:bg-surface-2 active:scale-95"
              >
                Eduroam Certificate
              </button>
              <button
                type="button"
                onClick={() => send("how do i get into duo two factor authentication?")}
                className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs text-off-white/90 hover:bg-surface-2 active:scale-95"
              >
                Duo 2FA Login
              </button>
            </div>
          </div>
        )}

        {/* Mobile-First Input Composer */}
        <footer className="z-20 shrink-0 border-t border-line bg-surface/95 px-3 py-2.5 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-3">
          <div className="flex flex-col gap-2">
            {showBar && (
              <DeflectionBar onAnswer={answerDeflection} busy={deflectBusy} />
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="flex items-end gap-2"
            >
              {/* Plus quick toggle button */}
              <button
                type="button"
                onClick={() => setShowQuickPicker((v) => !v)}
                title="Quick shortcuts"
                aria-label="Quick shortcuts"
                className={`grid size-11 shrink-0 place-items-center rounded-full border transition active:scale-95 ${
                  showQuickPicker
                    ? "border-success bg-success/20 text-lehman-bright"
                    : "border-line bg-black/25 text-light-green hover:bg-white/5 hover:text-white"
                }`}
              >
                <PlusIcon className={`size-5 transition-transform duration-200 ${showQuickPicker ? "rotate-45" : ""}`} />
              </button>

              <div className="relative flex min-h-11 flex-1 items-center rounded-[1.5rem] border border-line bg-black/35 px-4 py-1.5 shadow-inner transition-colors focus-within:border-success/60 focus-within:bg-black/50">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(draft);
                    }
                  }}
                  placeholder="Ask a campus tech question..."
                  aria-label="Message"
                  onFocus={() => setComposerFocused(true)}
                  onBlur={() => setComposerFocused(false)}
                  className="scroll-thin max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1 text-base leading-6 text-off-white placeholder:text-light-green/60 focus:outline-none"
                />
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!draft.trim() || pending}
                aria-label="Send"
                className="btn-primary grid size-11 shrink-0 place-items-center rounded-full text-white shadow-md transition disabled:opacity-40"
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
    <div className="flex animate-rise items-start gap-2.5 sm:gap-3">
      <BeeAvatar className="mt-0.5 size-8.5 sm:size-9" />
      <div className="max-w-[500px] rounded-[1.35rem] rounded-tl-sm border border-line bg-deep/95 p-4.5 text-[0.9375rem] leading-6 text-off-white shadow-xl sm:p-5">
        <div className="flex items-center gap-2">
          <Bee className="size-5" />
          <p className="font-semibold text-white">About CampusIT Co-Pilot</p>
        </div>
        <p className="mt-2 text-off-white/90">
          I&apos;m an <strong className="text-white font-semibold">unofficial, student-built</strong> AI helper created for Lehman College students, faculty, and staff.
        </p>
        <p className="mt-2 text-light-green">
          My mission is to help you fix Wi-Fi, login credentials, CUNYfirst, and student email problems instantly so you don&apos;t have to stand in line.
        </p>
        <div className="mt-3.5 rounded-xl border border-line bg-black/30 p-3 text-xs text-light-green">
          For official IT help or escalated issues, join the LehmanQ queue at{" "}
          <a
            href="https://www.lehman.edu/q"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lehman-bright underline"
          >
            lehman.edu/q
          </a>{" "}
          or visit <span className="text-white">Carman Hall 108</span>.
        </div>
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
      <div className="animate-rise rounded-2xl border border-error/40 bg-error/10 p-4 text-[0.875rem] text-off-white shadow-lg">
        <p className="font-semibold text-error">Backend not configured</p>
        <p className="mt-1 text-off-white/85">
          Please set <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-success">NEXT_PUBLIC_API_BASE_URL</code> in your environment.
        </p>
      </div>
    );
  }

  const rate = error.kind === "rate";
  return (
    <div className="animate-rise max-w-[420px] rounded-2xl border border-line bg-surface-2/90 p-4 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2.5 text-white">
        {rate ? (
          <ClockIcon className="size-5 text-lehman-bright" />
        ) : (
          <WifiIcon className="size-5 text-error" />
        )}
        <p className="text-[0.9375rem] font-semibold">
          {rate ? "Rate Limit Reached" : "Connection Dropped"}
        </p>
      </div>
      <p className="mt-2 text-[0.875rem] leading-6 text-light-green">
        {rate
          ? `One sec, too many messages right now. Try again in ${
              error.retryAfter ? `${error.retryAfter}s` : "a moment"
            }.`
          : "My connection dropped. Mind resending that?"}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-success/45 bg-success/10 px-4 text-[0.875rem] font-medium text-off-white transition hover:bg-success/20 active:scale-95"
      >
        <RefreshIcon className="size-4" />
        {rate ? "Try again" : "Retry message"}
      </button>
    </div>
  );
}
