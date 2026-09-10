type BeeProps = {
  className?: string;
  /** "happy" is the default face; "sleepy" is used for the no-results state. */
  mood?: "happy" | "sleepy";
  title?: string;
};

const BODY = "#f6c744";
const INK = "#20180d";

/** The CampusIT Co-Pilot mascot. Drawn inline so it stays crisp at every size. */
export function Bee({ className, mood = "happy", title }: BeeProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <clipPath id="bee-belly">
          <ellipse cx="32" cy="42" rx="13.5" ry="12.5" />
        </clipPath>
      </defs>

      {/* antennae */}
      <g stroke={INK} strokeWidth="2.3" strokeLinecap="round" fill="none">
        <path d="M25.5 12.5C23 8.5 22.5 5.5 24.5 4" />
        <path d="M38.5 12.5C41 8.5 41.5 5.5 39.5 4" />
      </g>
      <circle cx="24.1" cy="3.4" r="2.1" fill={INK} />
      <circle cx="39.9" cy="3.4" r="2.1" fill={INK} />

      {/* wings, tucked behind the body */}
      <g>
        <ellipse
          cx="14"
          cy="31"
          rx="10"
          ry="6.8"
          transform="rotate(-28 14 33)"
          fill="#e4f4ea"
          fillOpacity="0.9"
          stroke="#bfe0cd"
          strokeWidth="0.9"
        />
        <ellipse
          cx="50"
          cy="31"
          rx="10"
          ry="6.8"
          transform="rotate(28 50 33)"
          fill="#e4f4ea"
          fillOpacity="0.9"
          stroke="#bfe0cd"
          strokeWidth="0.9"
        />
      </g>

      {/* striped abdomen */}
      <g>
        <ellipse cx="32" cy="42" rx="13.5" ry="12.5" fill={BODY} />
        <g clipPath="url(#bee-belly)" fill={INK}>
          <rect x="16" y="36.4" width="32" height="4.6" rx="2.3" />
          <rect x="16" y="45" width="32" height="4.6" rx="2.3" />
        </g>
      </g>

      {/* head */}
      <circle cx="32" cy="24" r="12.6" fill={BODY} />

      {mood === "happy" ? (
        <>
          <ellipse cx="27.2" cy="23.2" rx="2.7" ry="3.2" fill={INK} />
          <ellipse cx="36.8" cy="23.2" rx="2.7" ry="3.2" fill={INK} />
          <circle cx="28.1" cy="22.1" r="0.95" fill="#fff" opacity="0.92" />
          <circle cx="37.7" cy="22.1" r="0.95" fill="#fff" opacity="0.92" />
          <path
            d="M28.8 28.6c1.1 1.5 5.3 1.5 6.4 0"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <path
            d="M24.6 23.4c1.3 1.6 3.6 1.6 4.9 0M34.5 23.4c1.3 1.6 3.6 1.6 4.9 0"
            stroke={INK}
            strokeWidth="1.9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M29.2 28.8c1.1 1.1 4.5 1.1 5.6 0"
            stroke={INK}
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </>
      )}
    </svg>
  );
}

/** Bee inside the glowing green disc used for avatars and the header. */
export function BeeAvatar({
  className = "size-9",
  mood,
}: {
  className?: string;
  mood?: "happy" | "sleepy";
}) {
  return (
    <span
      className={`${className} grid shrink-0 place-items-center overflow-hidden rounded-full border border-success/25 bg-deep ring-glow`}
    >
      <Bee className="size-[86%]" mood={mood} />
    </span>
  );
}
