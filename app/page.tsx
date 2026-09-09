import Link from "next/link";
import { Bee } from "@/components/bee";
import { ArrowIcon, BuildingIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="bg-splash relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <CampusSilhouette />

      <div className="relative flex w-full max-w-[420px] flex-col items-center">
        <Bee className="size-28 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] sm:size-32" />

        <h1 className="mt-6 text-[38px] leading-[1.1] font-bold tracking-tight text-white sm:text-[44px]">
          CampusIT
          <br />
          Co-Pilot
        </h1>
        <p className="mt-3 text-[15px] tracking-[0.04em] text-off-white/75">
          unofficial · student-built
        </p>

        <p className="mt-7 text-[16px] leading-7 text-off-white/90">
          Your AI assistant for Lehman College tech problems: Wi-Fi, CUNYfirst,
          and student email. No line. Just chat.
        </p>

        <Link
          href="/chat"
          className="btn-primary mt-9 flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[17px] font-semibold text-white"
        >
          Start chatting
          <ArrowIcon className="size-5" />
        </Link>

        <p className="mt-10 flex items-center gap-2 text-[14px] text-off-white/70">
          <BuildingIcon className="size-5" />
          Lehman College
        </p>
      </div>
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
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] w-full text-black/25 [mask-image:linear-gradient(to_bottom,transparent,black_55%)]"
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
