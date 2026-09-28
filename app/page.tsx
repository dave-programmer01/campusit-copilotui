import Link from "next/link";
import { Bee } from "@/components/bee";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col justify-between px-6 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <span className="grid size-12 place-items-center rounded-full border border-border bg-raised">
          <Bee className="size-8" />
        </span>

        <h1 className="mt-7 text-[2rem] leading-tight font-medium tracking-tight text-fg sm:text-[2.25rem]">
          CampusIT Co-Pilot
        </h1>
        <p className="mt-2 text-[0.9375rem] text-subtle">
          unofficial · student-built
        </p>

        <p className="mt-6 text-[1rem] leading-relaxed text-muted">
          Help with Lehman College tech problems: wifi, logging in, passwords
          and MFA. No line. Just chat.
        </p>

        <Link
          href="/chat"
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-6 text-[0.9375rem] font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          Start chatting
        </Link>
      </div>

      <p className="mx-auto w-full max-w-sm text-[0.8125rem] text-subtle">
        Not affiliated with Lehman College IT.
      </p>
    </main>
  );
}
