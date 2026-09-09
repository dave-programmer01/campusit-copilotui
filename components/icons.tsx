type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 10.5 12 4l8.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-3.5V15h-7v5.5H5A1.5 1.5 0 0 1 3.5 19Z" />
  </Svg>
);

export const WifiIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.4a9.4 9.4 0 0 1 12.4 0M9.1 15.8a4.8 4.8 0 0 1 5.8 0" />
    <circle cx="12" cy="19.3" r="1.05" fill="currentColor" stroke="none" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="10" width="16" height="10.5" rx="3" />
    <path d="M8.2 10V7.6a3.8 3.8 0 0 1 7.6 0V10" />
    <circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4.5 8.2 6.4 4.6a2 2 0 0 0 2.2 0l6.4-4.6" />
  </Svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.2M12 7.8h.01" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Svg>
);

export const SendIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" className={p.className} aria-hidden="true">
    <path d="M4.6 5.2 20 12 4.6 18.8l2.2-6.8-2.2-6.8Z" fill="currentColor" />
  </svg>
);

export const ClipIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 11.5 12.3 18.2a4.3 4.3 0 0 1-6.1-6.1l7.2-7.2a2.9 2.9 0 1 1 4.1 4.1l-7.1 7.1a1.5 1.5 0 0 1-2.1-2.1l6.4-6.4" />
  </Svg>
);

export const SmileIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.7 13.6a4.3 4.3 0 0 0 6.6 0M9.2 9.6h.01M14.8 9.6h.01" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.8 12.6 4.6 4.6L19.2 7.4" strokeWidth="2.1" />
  </Svg>
);

export const XIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" strokeWidth="2.1" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.4V12l3 1.8" />
  </Svg>
);

export const PinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s6.4-5.4 6.4-10.2a6.4 6.4 0 0 0-12.8 0C5.6 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.6" r="2.3" />
  </Svg>
);

export const BuildingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20.5h16M6.5 20.5V9.2L12 6l5.5 3.2v11.3" />
    <path d="M9.6 12.4h1.2M13.2 12.4h1.2M9.6 15.8h1.2M13.2 15.8h1.2" />
  </Svg>
);

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </Svg>
);

export const ArrowIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h14M13 6.5 18.5 12 13 17.5" />
  </Svg>
);

export const ExternalIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4.5h5.5V10M19 5l-7.6 7.6" />
    <path d="M18.5 13.8V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2h4.3" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.9" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="9.2" r="3.6" />
    <path d="M5.2 19.5a7 7 0 0 1 13.6 0" />
  </Svg>
);

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4.5V10h-5.5" />
  </Svg>
);
