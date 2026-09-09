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
  XIcon,
} from "./icons";

export type NavKey = "home" | "wifi" | "login" | "cunyfirst" | "about";

export const NAV: {
  key: NavKey;
  label: string;
  badge?: string;
  Icon: (p: { className?: string }) => React.ReactElement;
}[] = [
  { key: "home", label: "New Chat", Icon: HomeIcon },
  { key: "wifi", label: "Wi-Fi Help", badge: "eduroam", Icon: WifiIcon },
  { key: "login", label: "Login & Password", Icon: LockIcon },
  { key: "cunyfirst", label: "CUNYfirst / Email", Icon: MailIcon },
  { key: "about", label: "About Co-Pilot", Icon: InfoIcon },
];

export function Sidebar({
  active,
  onNavigate,
  onClose,
  onOpenRealPerson,
}: {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onClose?: () => void;
  onOpenRealPerson?: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
      <div className="flex flex-col gap-5">
        {/* Top bar with Mascot and Close button (on mobile) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-success/35 bg-deep ring-glow">
              <Bee className="size-8" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.9375rem] font-bold text-white">
                CampusIT Co-Pilot
              </p>
              <p className="truncate text-[0.75rem] text-light-green">
                unofficial · student-built
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="grid size-9 place-items-center rounded-xl text-light-green transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <XIcon className="size-5" />
            </button>
          )}
        </div>

        {/* Navigation buttons */}
        <nav className="mt-2 flex flex-col gap-1.5">
          <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-light-green/70">
            Quick Topics
          </p>
          {NAV.map(({ key, label, badge, Icon }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-12 items-center justify-between rounded-2xl px-3.5 py-3 text-[0.9375rem] transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? "border border-success/35 bg-success/15 font-semibold text-white shadow-sm"
                    : "border border-transparent text-off-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`size-5 shrink-0 ${isActive ? "text-lehman-bright" : "text-success/80"}`} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="rounded-full bg-success/20 px-2 py-0.5 text-[0.6875rem] font-medium text-lehman-bright">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Human Support Card */}
      <div className="mt-auto pt-4">
        <div className="rounded-2xl border border-line bg-surface/80 p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[0.8125rem] font-semibold text-white">
              Need a human?
            </p>
            {onOpenRealPerson && (
              <button
                type="button"
                onClick={onOpenRealPerson}
                className="text-[0.75rem] font-semibold text-lehman-bright hover:underline"
              >
                View Details
              </button>
            )}
          </div>
          <div className="mt-2 space-y-1">
            <a
              href="https://www.lehman.edu/q"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
            >
              <BuildingIcon className="size-5 shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] text-off-white">
                  LehmanQ <span className="text-xs text-lehman-bright">(online queue)</span>
                </p>
                <p className="truncate text-[0.6875rem] text-light-green">
                  lehman.edu/q
                </p>
              </div>
              <ChevronIcon className="size-4 shrink-0 text-success/70" />
            </a>
            <a
              href="https://maps.google.com/?q=Carman+Hall+Lehman+College+Bronx+NY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
            >
              <PinIcon className="size-5 shrink-0 text-success" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] text-off-white">
                  Carman Hall 108
                </p>
                <p className="truncate text-[0.6875rem] text-light-green">
                  In-person walk-in desk
                </p>
              </div>
              <ChevronIcon className="size-4 shrink-0 text-success/70" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
