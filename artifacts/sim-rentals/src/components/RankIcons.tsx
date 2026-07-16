/**
 * SKY SMS Rank Icons — Original geometric/tech-focused SVG designs
 * Each rank represents a tier of platform usage.
 */

interface RankIconProps {
  size?: number;
  className?: string;
}

/** Rank 1 — Initiate: Hexagon with inner triangle */
export function RankInitiate({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" stroke="#64748b" strokeWidth="2" fill="none" />
      <polygon points="24,14 34,20 34,32 24,38 14,32 14,20" fill="#94a3b8" opacity="0.4" />
      <circle cx="24" cy="26" r="4" fill="#64748b" />
    </svg>
  );
}

/** Rank 2 — Scout: Diamond with scan lines */
export function RankScout({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="16" y="16" width="16" height="16" rx="2" transform="rotate(45 24 24)" stroke="#38bdf8" strokeWidth="2" fill="none" />
      <line x1="12" y1="24" x2="36" y2="24" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />
      <line x1="24" y1="12" x2="24" y2="36" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />
      <circle cx="24" cy="24" r="3" fill="#38bdf8" />
      <circle cx="24" cy="24" r="6" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/** Rank 3 — Operative: Shield with circuit node */
export function RankOperative({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 6 L38 12 L38 26 C38 34 31 41 24 44 C17 41 10 34 10 26 L10 12 Z" stroke="#4574FF" strokeWidth="2" fill="rgba(69,116,255,0.08)" />
      <circle cx="24" cy="22" r="5" stroke="#4574FF" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="22" r="2" fill="#4574FF" />
      <line x1="24" y1="17" x2="24" y2="12" stroke="#4574FF" strokeWidth="1.5" />
      <line x1="29" y1="22" x2="34" y2="22" stroke="#4574FF" strokeWidth="1.5" />
      <line x1="19" y1="22" x2="14" y2="22" stroke="#4574FF" strokeWidth="1.5" />
      <line x1="24" y1="27" x2="24" y2="32" stroke="#4574FF" strokeWidth="1.5" />
    </svg>
  );
}

/** Rank 4 — Specialist: Layered hexagons */
export function RankSpecialist({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="24,4 40,13.5 40,32.5 24,44 8,32.5 8,13.5" stroke="#818cf8" strokeWidth="1.5" fill="rgba(129,140,248,0.1)" />
      <polygon points="24,11 35,17.5 35,30.5 24,37 13,30.5 13,17.5" stroke="#818cf8" strokeWidth="1.5" fill="rgba(129,140,248,0.15)" />
      <polygon points="24,18 30,21.5 30,28.5 24,32 18,28.5 18,21.5" fill="#818cf8" opacity="0.7" />
      <circle cx="24" cy="25" r="2.5" fill="#f8fafc" />
    </svg>
  );
}

/** Rank 5 — Elite: Star-octagon with orbital ring */
export function RankElite({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="18" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
      <path d="M24 6 L27.5 17 L39 14 L31 22 L42 24 L31 26 L39 34 L27.5 31 L24 42 L20.5 31 L9 34 L17 26 L6 24 L17 22 L9 14 L20.5 17 Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.15)" />
      <circle cx="24" cy="24" r="5" fill="#06b6d4" opacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="white" />
    </svg>
  );
}

/** Rank 6 — Master: Prism with energy core */
export function RankMaster({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="24,4 44,36 4,36" stroke="#a855f7" strokeWidth="2" fill="rgba(168,85,247,0.1)" />
      <polygon points="24,12 38,34 10,34" stroke="#a855f7" strokeWidth="1.5" fill="rgba(168,85,247,0.15)" />
      <line x1="24" y1="4" x2="24" y2="36" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="36" x2="38" y2="18" stroke="#a855f7" strokeWidth="1" opacity="0.3" />
      <line x1="44" y1="36" x2="10" y2="18" stroke="#a855f7" strokeWidth="1" opacity="0.3" />
      <circle cx="24" cy="27" r="5" fill="#a855f7" opacity="0.8" />
      <circle cx="24" cy="27" r="2.5" fill="white" />
    </svg>
  );
}

/** Rank 7 — Legend: Crown of geometric spires */
export function RankLegend({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer glow ring */}
      <circle cx="24" cy="24" r="20" stroke="#f59e0b" strokeWidth="1" opacity="0.2" />
      <circle cx="24" cy="24" r="16" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
      {/* Crown shape */}
      <path d="M8 36 L8 22 L16 30 L24 10 L32 30 L40 22 L40 36 Z" stroke="#f59e0b" strokeWidth="2" fill="rgba(245,158,11,0.15)" strokeLinejoin="round" />
      {/* Gems */}
      <circle cx="24" cy="32" r="3" fill="#f59e0b" />
      <circle cx="14" cy="33" r="2" fill="#fbbf24" opacity="0.7" />
      <circle cx="34" cy="33" r="2" fill="#fbbf24" opacity="0.7" />
      {/* Shine */}
      <circle cx="24" cy="32" r="1.2" fill="white" opacity="0.8" />
    </svg>
  );
}

/** Map of rank number → name + icon + color */
export const RANKS = [
  { level: 1, name: "Initiate",   Icon: RankInitiate,  color: "#64748b", bgColor: "bg-slate-100",   textColor: "text-slate-600",   borderColor: "border-slate-200",   minRentals: 0   },
  { level: 2, name: "Scout",      Icon: RankScout,     color: "#38bdf8", bgColor: "bg-sky-50",      textColor: "text-sky-600",     borderColor: "border-sky-200",     minRentals: 5   },
  { level: 3, name: "Operative",  Icon: RankOperative, color: "#4574FF", bgColor: "bg-blue-50",     textColor: "text-blue-600",    borderColor: "border-blue-200",    minRentals: 20  },
  { level: 4, name: "Specialist", Icon: RankSpecialist,color: "#818cf8", bgColor: "bg-indigo-50",   textColor: "text-indigo-600",  borderColor: "border-indigo-200",  minRentals: 50  },
  { level: 5, name: "Elite",      Icon: RankElite,     color: "#06b6d4", bgColor: "bg-cyan-50",     textColor: "text-cyan-600",    borderColor: "border-cyan-200",    minRentals: 100 },
  { level: 6, name: "Master",     Icon: RankMaster,    color: "#a855f7", bgColor: "bg-purple-50",   textColor: "text-purple-600",  borderColor: "border-purple-200",  minRentals: 250 },
  { level: 7, name: "Legend",     Icon: RankLegend,    color: "#f59e0b", bgColor: "bg-orange-50",   textColor: "text-orange-600",  borderColor: "border-orange-200",  minRentals: 500 },
] as const;

export function getRankForRentals(totalRentals: number) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (totalRentals >= r.minRentals) rank = r;
    else break;
  }
  return rank;
}

export function RankBadge({ totalRentals, size = "md" }: { totalRentals: number; size?: "sm" | "md" | "lg" }) {
  const rank = getRankForRentals(totalRentals);
  const sizeMap = { sm: 20, md: 28, lg: 40 };
  const textSizeMap = { sm: "text-[10px]", md: "text-[11px]", lg: "text-[13px]" };
  const padMap = { sm: "px-2 py-0.5 gap-1", md: "px-2.5 py-1 gap-1.5", lg: "px-3 py-1.5 gap-2" };

  return (
    <span className={`inline-flex items-center rounded-full border ${rank.bgColor} ${rank.borderColor} ${padMap[size]}`}>
      <rank.Icon size={sizeMap[size]} />
      <span className={`font-bold ${rank.textColor} ${textSizeMap[size]}`}>{rank.name}</span>
    </span>
  );
}
