/**
 * SKY SMS Rank Icons — Original geometric/tech-focused SVG designs
 * Each rank represents a tier of platform usage.
 */

interface RankIconProps {
  size?: number;
  className?: string;
}

/** Rank 1 — Initiate: Hexagonal circuit node */
export function RankInitiate({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="24,5 40,14.5 40,33.5 24,43 8,33.5 8,14.5" stroke="#64748b" strokeWidth="1.8" fill="none" opacity="0.6" />
      <line x1="24" y1="5" x2="24" y2="13" stroke="#64748b" strokeWidth="1.2" opacity="0.5" />
      <line x1="40" y1="14.5" x2="33" y2="18.5" stroke="#64748b" strokeWidth="1.2" opacity="0.5" />
      <line x1="40" y1="33.5" x2="33" y2="29.5" stroke="#64748b" strokeWidth="1.2" opacity="0.5" />
      <circle cx="24" cy="13" r="2" fill="#64748b" opacity="0.7" />
      <circle cx="33" cy="18.5" r="2" fill="#64748b" opacity="0.7" />
      <circle cx="33" cy="29.5" r="2" fill="#64748b" opacity="0.7" />
      <circle cx="24" cy="24" r="4.5" stroke="#94a3b8" strokeWidth="1.5" fill="rgba(148,163,184,0.2)" />
      <circle cx="24" cy="24" r="2" fill="#64748b" />
    </svg>
  );
}

/** Rank 2 — Scout: Diamond targeting reticle */
export function RankScout({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="14" y="14" width="20" height="20" rx="2" transform="rotate(45 24 24)" stroke="#38bdf8" strokeWidth="1.8" fill="rgba(56,189,248,0.06)" />
      <line x1="24" y1="6" x2="24" y2="17" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
      <line x1="24" y1="31" x2="24" y2="42" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
      <line x1="6" y1="24" x2="17" y2="24" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
      <line x1="31" y1="24" x2="42" y2="24" stroke="#38bdf8" strokeWidth="1.2" opacity="0.6" />
      <circle cx="24" cy="24" r="7" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.35" />
      <circle cx="24" cy="24" r="2.5" fill="#38bdf8" />
      <circle cx="24" cy="24" r="1" fill="white" opacity="0.9" />
    </svg>
  );
}

/** Rank 3 — Operative: Shield with neural circuit */
export function RankOperative({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path d="M24 5 L40 12 L40 27 C40 36 32 43 24 46 C16 43 8 36 8 27 L8 12 Z"
        stroke="#4574FF" strokeWidth="1.8" fill="rgba(69,116,255,0.06)" />
      <path d="M24 13 L34 17 L34 27 C34 33 29 38 24 40 C19 38 14 33 14 27 L14 17 Z"
        stroke="#4574FF" strokeWidth="1" fill="rgba(69,116,255,0.08)" opacity="0.6" />
      <circle cx="24" cy="24" r="4" stroke="#4574FF" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="24" r="1.8" fill="#4574FF" />
      <line x1="24" y1="20" x2="24" y2="15" stroke="#4574FF" strokeWidth="1.2" />
      <line x1="27.5" y1="24" x2="32" y2="24" stroke="#4574FF" strokeWidth="1.2" />
      <line x1="20.5" y1="24" x2="16" y2="24" stroke="#4574FF" strokeWidth="1.2" />
      <circle cx="24" cy="15" r="1.5" fill="#4574FF" opacity="0.6" />
      <circle cx="32" cy="24" r="1.5" fill="#4574FF" opacity="0.6" />
      <circle cx="16" cy="24" r="1.5" fill="#4574FF" opacity="0.6" />
    </svg>
  );
}

/** Rank 4 — Specialist: Nested hexagonal prism */
export function RankSpecialist({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="24,4 42,14 42,34 24,44 6,34 6,14"
        stroke="#818cf8" strokeWidth="1.5" fill="rgba(129,140,248,0.05)" />
      <polygon points="24,10 37,17.5 37,30.5 24,38 11,30.5 11,17.5"
        stroke="#818cf8" strokeWidth="1.5" fill="rgba(129,140,248,0.08)" />
      <polygon points="24,17 32,21.5 32,29.5 24,34 16,29.5 16,21.5"
        stroke="#818cf8" strokeWidth="1.5" fill="rgba(129,140,248,0.15)" />
      <line x1="24" y1="4" x2="24" y2="10" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="38" x2="24" y2="44" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
      <line x1="42" y1="14" x2="37" y2="17.5" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="14" x2="11" y2="17.5" stroke="#818cf8" strokeWidth="1" opacity="0.5" />
      <circle cx="24" cy="25.5" r="3" fill="#818cf8" opacity="0.9" />
      <circle cx="24" cy="25.5" r="1.2" fill="white" opacity="0.8" />
    </svg>
  );
}

/** Rank 5 — Elite: Octagram with orbital ring */
export function RankElite({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="19" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="24" cy="24" r="15" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.25" />
      <path d="M24 8L26.5 17.5L36 15L29.5 22L39 24L29.5 26L36 33L26.5 30.5L24 40L21.5 30.5L12 33L18.5 26L9 24L18.5 22L12 15L21.5 17.5Z"
        stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.12)" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="5" fill="#06b6d4" opacity="0.9" />
      <circle cx="24" cy="24" r="2.5" fill="rgba(6,182,212,0.3)" />
      <circle cx="24" cy="24" r="1.2" fill="white" />
    </svg>
  );
}

/** Rank 6 — Master: Triangular prism with refraction */
export function RankMaster({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <polygon points="24,5 44,38 4,38"
        stroke="#a855f7" strokeWidth="1.8" fill="rgba(168,85,247,0.08)" />
      <polygon points="24,13 38,36 10,36"
        stroke="#a855f7" strokeWidth="1.2" fill="rgba(168,85,247,0.1)" opacity="0.7" />
      <line x1="24" y1="5" x2="24" y2="38" stroke="#a855f7" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="38" x2="36" y2="20" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" />
      <line x1="44" y1="38" x2="12" y2="20" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" />
      <line x1="24" y1="13" x2="14" y2="7" stroke="#a855f7" strokeWidth="0.8" opacity="0.25" />
      <line x1="24" y1="13" x2="34" y2="7" stroke="#a855f7" strokeWidth="0.8" opacity="0.25" />
      <circle cx="24" cy="29" r="5.5" fill="#a855f7" opacity="0.85" />
      <circle cx="24" cy="29" r="2.5" fill="rgba(168,85,247,0.4)" />
      <circle cx="24" cy="29" r="1.2" fill="white" />
    </svg>
  );
}

/** Rank 7 — Legend: Crown of crystalline spires (rose/crimson) */
export function RankLegend({ size = 32, className = "" }: RankIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="20" stroke="#e11d48" strokeWidth="0.8" opacity="0.2" />
      <circle cx="24" cy="24" r="16" stroke="#e11d48" strokeWidth="0.8" opacity="0.15" />
      {/* Crown */}
      <path d="M7 37 L7 21 L15 30 L24 9 L33 30 L41 21 L41 37 Z"
        stroke="#e11d48" strokeWidth="1.8" fill="rgba(225,29,72,0.1)" strokeLinejoin="round" />
      {/* Crown base line */}
      <line x1="7" y1="37" x2="41" y2="37" stroke="#e11d48" strokeWidth="1.5" />
      {/* Center gem */}
      <polygon points="24,29 27,33 24,37 21,33" fill="#e11d48" opacity="0.9" />
      <polygon points="24,29 27,33 24,37 21,33" stroke="#e11d48" strokeWidth="0.5" fill="none" />
      {/* Side gems */}
      <polygon points="13,33 15.5,36 13,38 10.5,36" fill="#e11d48" opacity="0.55" />
      <polygon points="35,33 37.5,36 35,38 32.5,36" fill="#e11d48" opacity="0.55" />
      {/* Shine */}
      <circle cx="24" cy="31.5" r="1" fill="white" opacity="0.85" />
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
  { level: 7, name: "Legend",     Icon: RankLegend,    color: "#e11d48", bgColor: "bg-rose-50",     textColor: "text-rose-600",    borderColor: "border-rose-200",    minRentals: 500 },
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
