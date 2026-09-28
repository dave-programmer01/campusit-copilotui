"use client";

import { Bee } from "./bee";
import {
  BuildingIcon,
  ChevronIcon,
  HomeIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  PinIcon,
  WifiIcon,
} from "./icons";

export type NavKey = "home" | "wifi" | "login" | "cunyfirst" | "about";

export const NAV: {
  key: NavKey;
  label: string;
  Icon: (p: { className?: string }) => React.ReactElement;
}[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "wifi", label: "Wi-Fi Help", Icon: WifiIcon },
  { key: "login", label: "Login Help", Icon: LockIcon },
  { key: "cunyfirst", label: "CUNYfirst / Email", Icon: MailIcon },
  { key: "about", label: "About", Icon: InfoIcon },
];

export function Sidebar({
  active,
  onNavigate,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-3 px-1 pt-1">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-raised">
          <Bee className="size-7" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-medium text-fg">
            CampusIT Co-Pilot
          </p>
          <p className="truncate text-[0.75rem] text-subtle">
            unofficial · student-built
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ key, label, Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(key)}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 py-3 text-[0.9375rem] transition ${
                isActive
                  ? "bg-raised text-fg"
                  : "text-muted hover:bg-raised/60 hover:text-fg"
              }`}
            >
              <Icon className="size-4.5 shrink-0 text-subtle" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <p className="px-2 text-[0.75rem] tracking-wide text-subtle uppercase">
          Need to talk to a real person?
        </p>
        <a
          href="https://www.lehman.edu/q"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex min-h-12 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
        >
          <BuildingIcon className="size-4.5 shrink-0 text-subtle" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] text-fg">
              LehmanQ
            </span>
            <span className="block truncate text-[0.6875rem] text-subtle">
              lehman.edu/q
            </span>
          </span>
          <ChevronIcon className="size-3.5 shrink-0 text-subtle" />
        </a>
        <a
          href="https://maps.google.com/?q=Carman+Hall+Lehman+College+Bronx+NY"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex min-h-12 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
        >
          <PinIcon className="size-4.5 shrink-0 text-subtle" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.8125rem] text-fg">
              Carman Hall 108
            </span>
            <span className="block truncate text-[0.6875rem] text-subtle">
              (in person)
            </span>
          </span>
          <ChevronIcon className="size-3.5 shrink-0 text-subtle" />
        </a>
      </div>
    </div>
  );
}
