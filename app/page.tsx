import Link from "next/link";
import { Bee } from "@/components/bee";
import {
  ArrowIcon,
  BuildingIcon,
  LockIcon,
  MailIcon,
  SparklesIcon,
  WifiIcon,
} from "@/components/icons";

const QUICK_TOPICS = [
  {
    key: "wifi",
    title: "Wi-Fi Help",
    desc: "Connect to eduroam & fix drops",
    Icon: WifiIcon,
  },
  {
    key: "login",
    title: "Password Reset",
    desc: "Unlock Lehman login & CUNY ID",
    Icon: LockIcon,
  },
  {
    key: "cunyfirst",
    title: "CUNYfirst & Email",
    desc: "Access student email & schedule",
    Icon: MailIcon,
  },
];

export default function Home() {
  return (
    <main className="bg-splash relative flex min-h-dvh flex-col justify-between overflow-x-hidden px-4 py-6 text-center sm:px-6 sm:py-10">
      <CampusSilhouette />

      {/* Top Brand Tag */}
      <header className="relative z-10 mx-auto flex w-full max-w-[440px] items-center justify-between px-2 pt-1">
        <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-black/40 px-3 py-1 text-xs font-semibold text-off-white/90 backdrop-blur-md">
          <span className="size-2 rounded-full bg-lehman-bright animate-pulse" />
          unofficial · student-built
        </span>

        <span className="flex items-center gap-1.5 text-xs text-light-green/90">
          <BuildingIcon className="size-4 text-success" />
          Lehman College
        </span>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col items-center justify-center py-6">
        {/* Animated Bee Mascot Container */}
        <div className="group relative">
          <div className="absolute inset-0 -m-6 rounded-full bg-radial from-success/30 to-transparent blur-2xl animate-pulse-glow" />
          <div className="relative flex size-28 items-center justify-center rounded-full border border-success/35 bg-deep/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-sm sm:size-32">
            <Bee className="size-20 drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 sm:size-24" />
          </div>
        </div>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl sm:leading-[1.15]">
          campus tech broken?
          <span className="block text-lehman-bright">i got you.</span>
        </h1>

        <p className="mt-2.5 max-w-[340px] text-[0.9375rem] leading-6 text-off-white/85 sm:text-base">
          Fix campus Wi-Fi, login credentials, CUNYfirst, and student email without waiting in line.
        </p>

        {/* Primary CTA */}
        <Link
          href="/chat"
          className="btn-primary mt-6 flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-semibold text-white shadow-xl sm:text-[1.0625rem]"
        >
          <SparklesIcon className="size-5" />
          Start chatting
          <ArrowIcon className="size-5" />
        </Link>

        {/* Quick Issue Selector for fast mobile entry */}
        <div className="mt-7 w-full text-left">
          <p className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-wider text-light-green/80">
            Or pick your issue directly:
          </p>
          <div className="grid gap-2">
            {QUICK_TOPICS.map(({ key, title, desc, Icon }) => (
              <Link
                key={key}
                href={`/chat?topic=${key}`}
                className="card-glass card-glass-hover flex items-center justify-between rounded-2xl p-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-white">{title}</h2>
                    <p className="text-xs text-light-green">{desc}</p>
                  </div>
                </div>
                <ArrowIcon className="size-4 shrink-0 text-light-green/60" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Human Desk Bottom Notice */}
      <footer className="relative z-10 mx-auto w-full max-w-[440px] pt-4 pb-2">
        <div className="flex items-center justify-center gap-2 text-xs text-off-white/70">
          <span>Walk-in desk: <strong className="text-white font-medium">Carman Hall 108</strong></span>
          <span>•</span>
          <a
            href="https://www.lehman.edu/q"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lehman-bright hover:underline"
          >
            LehmanQ online ↗
          </a>
        </div>
      </footer>
    </main>
  );
}

/** The faint campus skyline behind the splash. */
function CampusSilhouette() {
  return (
    <svg
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] w-full text-black/35 [mask-image:linear-gradient(to_bottom,transparent,black_50%)]"
      fill="currentColor"
    >
      <path d="M0 120V74h18V56h10v18h16V46h8v28h22V62h26v58H0Z" />
      <path d="M108 120V50h14V34l14-10 14 10v16h14v70h-56Zm22-52h14v12h-14V68Z" />
      <path d="M178 120V66h30V52h8v14h30v54h-68Zm18-38h14v12h-14V82Zm28 0h14v12h-14V82Z" />
      <path d="M254 120V58h20V40h10v18h18v62h-48Z" />
      <path d="M312 120V70h24V54h10v16h20v18h34v32h-88Z" />
    </svg>
  );
}
