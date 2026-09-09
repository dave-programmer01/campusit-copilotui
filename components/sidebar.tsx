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
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-success/25 bg-deep ring-glow">
          <Bee className="size-8" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-white">
            CampusIT Co-Pilot
          </p>
          <p className="truncate text-[12px] text-light-green">
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
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[15px] transition ${
                isActive
                  ? "border border-success/25 bg-success/12 font-medium text-white"
                  : "border border-transparent text-off-white/80 hover:bg-white/5"
              }`}
            >
              <Icon className="size-5 shrink-0 text-success/90" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-line bg-black/20 p-3.5">
        <p className="text-[13px] font-semibold text-white">
          Need to talk to a real person?
        </p>
        <a
          href="https://www.lehman.edu/q"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-3 rounded-xl px-1 py-1.5 transition hover:bg-white/5"
        >
          <BuildingIcon className="size-6 shrink-0 text-success" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] text-off-white">
              LehmanQ <span className="text-success">(online)</span>
            </span>
            <span className="block truncate text-[11px] text-light-green">
              lehman.edu/q
            </span>
          </span>
          <ChevronIcon className="size-4 shrink-0 text-success" />
        </a>
        <a
          href="https://maps.google.com/?q=Carman+Hall+Lehman+College+Bronx+NY"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-3 rounded-xl px-1 py-1.5 transition hover:bg-white/5"
        >
          <PinIcon className="size-6 shrink-0 text-success" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] text-off-white">
              Carman Hall 108
            </span>
            <span className="block truncate text-[11px] text-light-green">
              (in person)
            </span>
          </span>
          <ChevronIcon className="size-4 shrink-0 text-success" />
        </a>
      </div>
    </div>
  );
}
