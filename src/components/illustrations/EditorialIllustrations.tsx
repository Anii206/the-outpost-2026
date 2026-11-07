import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * 1. GraduationCapIllustration
 * Mortarboard cap, dangling tassel, rolled parchment diploma with vermilion ribbon, and goose quill pen.
 */
export const GraduationCapIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 180,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`editorial-illustration select-none ${className}`}
    aria-hidden="true"
  >
    {/* Background warm halo */}
    <circle cx="100" cy="100" r="76" className="fill-surface-2/60 stroke-border" strokeWidth="1" strokeDasharray="3 3" />

    {/* Rolled Diploma Scroll */}
    <g transform="rotate(-18 100 135)">
      <rect x="50" y="132" width="95" height="24" rx="3" className="fill-surface stroke-text" strokeWidth="1.75" />
      <path d="M54 135L54 153" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M141 135L141 153" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      {/* Vermilion ribbon */}
      <rect x="90" y="130" width="16" height="28" rx="1.5" className="fill-accent stroke-accent" strokeWidth="1" />
      <path d="M93 158L98 168L103 158" className="fill-accent stroke-accent" strokeWidth="1" />
      <path d="M99 158L104 168L108 158" className="fill-accent stroke-accent" strokeWidth="1" />
    </g>

    {/* Mortarboard Diamond Skull Cap Base */}
    <path
      d="M72 96 C72 118, 128 118, 128 96"
      className="fill-surface-2 stroke-text"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M80 108 C88 114, 112 114, 120 108" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />

    {/* Diamond Cap Top (in bold perspective) */}
    <polygon
      points="100,42 166,68 100,94 34,68"
      className="fill-surface stroke-text"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <polygon
      points="100,46 160,70 100,90 40,70"
      className="fill-primary/10 stroke-primary/30"
      strokeWidth="1"
    />

    {/* Center Button */}
    <circle cx="100" cy="68" r="4.5" className="fill-accent stroke-text" strokeWidth="1.5" />

    {/* Tassel cord curving down */}
    <path
      d="M100 68 C120 70, 142 80, 148 102"
      className="stroke-accent"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Tassel fringe */}
    <path d="M145 102 L142 124 L154 124 L151 102 Z" className="fill-accent stroke-text" strokeWidth="1.5" />
    <line x1="148" y1="106" x2="148" y2="122" stroke="var(--primary-contrast)" strokeWidth="1" strokeLinecap="round" />

    {/* Engraved Quill Pen */}
    <g transform="translate(125, 40) rotate(32)">
      <path
        d="M0 0 C4 18, 12 36, 0 60 C-6 40, -4 20, 0 0 Z"
        className="fill-surface stroke-text"
        strokeWidth="1.5"
      />
      <line x1="0" y1="5" x2="0" y2="55" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M0 60 L-1 68 L1 68 Z" className="fill-accent stroke-accent" strokeWidth="1" />
    </g>
  </svg>
);

/**
 * 2. StampedDocumentIllustration
 * Official broadsheet gazette ledger with ruled lines and a vermilion wax/stamp mark.
 */
export const StampedDocumentIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 180,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`editorial-illustration select-none ${className}`}
    aria-hidden="true"
  >
    {/* Shadow page */}
    <rect x="52" y="36" width="108" height="136" rx="3" className="fill-surface-2 stroke-border" strokeWidth="1.5" />

    {/* Foreground page */}
    <rect x="44" y="28" width="108" height="136" rx="3" className="fill-surface stroke-text" strokeWidth="2" />
    
    {/* Masthead rule */}
    <line x1="56" y1="44" x2="140" y2="44" stroke="currentColor" strokeWidth="2.5" />
    <line x1="56" y1="48" x2="140" y2="48" stroke="currentColor" strokeWidth="1" />

    {/* Header text placeholder */}
    <rect x="56" y="55" width="48" height="6" rx="1" className="fill-primary" />
    <rect x="110" y="55" width="30" height="6" rx="1" className="fill-text/30" />

    {/* Newspaper 2-column ruled text hatching */}
    <line x1="98" y1="68" x2="98" y2="128" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="2 2" />
    
    {/* Column 1 */}
    <line x1="56" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="56" y1="78" x2="92" y2="78" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="56" y1="86" x2="88" y2="86" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="56" y1="94" x2="92" y2="94" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="56" y1="102" x2="86" y2="102" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />

    {/* Column 2 */}
    <line x1="106" y1="70" x2="140" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="106" y1="78" x2="138" y2="78" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="106" y1="86" x2="136" y2="86" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="106" y1="94" x2="140" y2="94" stroke="var(--text-muted)" strokeWidth="1.2" strokeLinecap="round" />

    {/* Red Ink Seal / Stamp (rotated authentic look) */}
    <g transform="translate(108, 114) rotate(-14)">
      <circle cx="22" cy="22" r="24" className="stroke-accent fill-surface" strokeWidth="2" strokeDasharray="3 1.5" />
      <circle cx="22" cy="22" r="20" className="stroke-accent" strokeWidth="1" />
      <path d="M14 18 L22 12 L30 18 L26 28 L18 28 Z" className="fill-accent/20 stroke-accent" strokeWidth="1.2" />
      <text x="22" y="24" textAnchor="middle" className="font-mono text-[7px] font-bold fill-accent tracking-widest">
        DOCKET
      </text>
    </g>

    {/* Folded page corner */}
    <path d="M136 148 L152 148 L152 164 Z" className="fill-surface-2 stroke-text" strokeWidth="1.5" />
  </svg>
);

/**
 * 3. CalendarNoticeIllustration
 * Desk calendar with tear-off top, spiral binding, and a vermilion circled deadline date.
 */
export const CalendarNoticeIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 180,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`editorial-illustration select-none ${className}`}
    aria-hidden="true"
  >
    {/* Shadow under calendar */}
    <rect x="46" y="44" width="112" height="120" rx="4" className="fill-surface-2 stroke-border" strokeWidth="1.5" />

    {/* Calendar Card */}
    <rect x="40" y="38" width="112" height="120" rx="4" className="fill-surface stroke-text" strokeWidth="2" />

    {/* Header bar (deep green) */}
    <path d="M40 42 C40 39, 42 38, 45 38 L147 38 C150 38, 152 39, 152 42 L152 68 L40 68 Z" className="fill-primary" />
    <text x="96" y="56" textAnchor="middle" className="fill-primary-contrast font-serif text-[11px] font-bold tracking-wider uppercase">
      NOVEMBER 2026
    </text>

    {/* Binding Rings */}
    {[58, 84, 110, 134].map((x) => (
      <g key={x}>
        <rect x={x - 3} y="32" width="6" height="12" rx="3" className="fill-surface stroke-text" strokeWidth="1.5" />
        <circle cx={x} cy="38" r="1.5" className="fill-accent" />
      </g>
    ))}

    {/* Weekday indicators */}
    <g className="font-mono text-[8px] fill-text-muted" transform="translate(48, 80)">
      <text x="0" y="0">M</text>
      <text x="16" y="0">T</text>
      <text x="32" y="0">W</text>
      <text x="48" y="0">T</text>
      <text x="64" y="0">F</text>
      <text x="80" y="0" className="fill-accent font-bold">S</text>
    </g>

    {/* Date Dots Grid */}
    {[95, 110, 125, 140].map((y, rowIdx) => (
      <g key={y} transform={`translate(48, ${y})`}>
        {[0, 16, 32, 48, 64, 80].map((x, colIdx) => {
          const isCircled = rowIdx === 1 && colIdx === 2; // Date 15
          if (isCircled) {
            return (
              <g key={x}>
                <circle cx={x + 3} cy="-3" r="10" className="stroke-accent fill-accent/15" strokeWidth="1.75" strokeDasharray="2 1" />
                <text x={x + 3} y="0.5" textAnchor="middle" className="font-mono text-[9px] font-bold fill-accent">
                  15
                </text>
              </g>
            );
          }
          return (
            <circle key={x} cx={x + 3} cy="-3" r="1.75" className="fill-border-strong" />
          );
        })}
      </g>
    ))}

    {/* Urgent Clock Stamp Banner */}
    <g transform="translate(100, 142) rotate(-3)">
      <rect x="0" y="0" width="56" height="16" rx="2" className="fill-accent text-primary-contrast" />
      <text x="28" y="11" textAnchor="middle" className="font-sans text-[8px] font-bold fill-primary-contrast uppercase tracking-widest">
        FINAL CALL
      </text>
    </g>
  </svg>
);

/**
 * 4. RupeeCoinStackIllustration
 * Engraved 3D isometric stack of Indian Rupee coins with security hatching and sunburst.
 */
export const RupeeCoinStackIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 180,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`editorial-illustration select-none ${className}`}
    aria-hidden="true"
  >
    {/* Background Sunburst rays */}
    <g className="stroke-border" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
      <line x1="100" y1="20" x2="100" y2="40" />
      <line x1="160" y1="45" x2="145" y2="58" />
      <line x1="180" y1="100" x2="160" y2="100" />
      <line x1="40" y1="45" x2="55" y2="58" />
      <line x1="20" y1="100" x2="40" y2="100" />
    </g>

    {/* Base Coin (Bottom) */}
    <g transform="translate(0, 48)">
      <ellipse cx="100" cy="116" rx="52" ry="17" className="fill-surface-2 stroke-text" strokeWidth="2" />
      <path d="M48 116 L48 126 C48 135, 152 135, 152 126 L152 116" className="fill-surface-2 stroke-text" strokeWidth="2" />
    </g>

    {/* Middle Coin */}
    <g transform="translate(0, 24)">
      <ellipse cx="100" cy="116" rx="52" ry="17" className="fill-surface stroke-text" strokeWidth="2" />
      <path d="M48 116 L48 126 C48 135, 152 135, 152 126 L152 116" className="fill-surface stroke-text" strokeWidth="2" />
      {/* Coin reeding */}
      <line x1="58" y1="120" x2="58" y2="128" stroke="currentColor" strokeWidth="1" />
      <line x1="72" y1="124" x2="72" y2="131" stroke="currentColor" strokeWidth="1" />
      <line x1="128" y1="124" x2="128" y2="131" stroke="currentColor" strokeWidth="1" />
      <line x1="142" y1="120" x2="142" y2="128" stroke="currentColor" strokeWidth="1" />
    </g>

    {/* Top Coin */}
    <g transform="translate(0, 0)">
      <ellipse cx="100" cy="116" rx="52" ry="17" className="fill-surface stroke-text" strokeWidth="2" />
      <path d="M48 116 L48 126 C48 135, 152 135, 152 126 L152 116" className="fill-surface stroke-text" strokeWidth="2" />
      
      {/* Inner concentric ring */}
      <ellipse cx="100" cy="116" rx="42" ry="13.5" className="stroke-primary/50" strokeWidth="1" strokeDasharray="3 2" />
      
      {/* Center Rupee Sign in perspective */}
      <text
        x="100"
        y="123"
        textAnchor="middle"
        className="font-serif font-black text-2xl fill-primary"
        transform="scale(1, 0.72) translate(0, 46)"
      >
        ₹
      </text>
    </g>

    {/* Floating grant sparkle tag */}
    <g transform="translate(126, 42) rotate(12)">
      <rect x="0" y="0" width="46" height="20" rx="2" className="fill-primary text-primary-contrast" />
      <text x="23" y="14" textAnchor="middle" className="font-mono text-[9px] font-bold fill-primary-contrast">
        SCHOLAR
      </text>
    </g>
  </svg>
);

/**
 * 5. MagnifierDocketIllustration
 * Editorial magnifying glass inspecting an open broadsheet ledger.
 */
export const MagnifierDocketIllustration: React.FC<IllustrationProps> = ({
  className = '',
  size = 180,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`editorial-illustration select-none ${className}`}
    aria-hidden="true"
  >
    {/* Base Newspaper spread */}
    <g transform="rotate(-6 100 110)">
      <rect x="36" y="56" width="128" height="96" rx="3" className="fill-surface stroke-text" strokeWidth="2" />
      <line x1="100" y1="56" x2="100" y2="152" stroke="var(--border-strong)" strokeWidth="1.5" />
      {/* Ruled lines */}
      <line x1="48" y1="72" x2="88" y2="72" stroke="currentColor" strokeWidth="2" />
      <line x1="48" y1="82" x2="88" y2="82" stroke="var(--text-muted)" strokeWidth="1.2" />
      <line x1="48" y1="92" x2="84" y2="92" stroke="var(--text-muted)" strokeWidth="1.2" />
      <line x1="48" y1="102" x2="88" y2="102" stroke="var(--text-muted)" strokeWidth="1.2" />
      <line x1="48" y1="112" x2="80" y2="112" stroke="var(--text-muted)" strokeWidth="1.2" />

      <line x1="112" y1="72" x2="152" y2="72" stroke="currentColor" strokeWidth="2" />
      <line x1="112" y1="82" x2="152" y2="82" stroke="var(--text-muted)" strokeWidth="1.2" />
      <line x1="112" y1="92" x2="148" y2="92" stroke="var(--text-muted)" strokeWidth="1.2" />
      <line x1="112" y1="102" x2="152" y2="102" stroke="var(--text-muted)" strokeWidth="1.2" />
    </g>

    {/* Large Magnifying Glass Glass & Rim */}
    <g transform="translate(10, 10)">
      {/* Handle */}
      <path
        d="M136 136 L174 174"
        stroke="var(--text)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M136 136 L174 174"
        stroke="var(--primary)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Outer Rim */}
      <circle cx="94" cy="94" r="44" className="fill-surface stroke-text" strokeWidth="3" />
      {/* Glass tint */}
      <circle cx="94" cy="94" r="41" className="fill-primary/10" />

      {/* Magnified inspected content */}
      <g transform="translate(70, 74)">
        <rect x="0" y="0" width="48" height="20" rx="2" className="fill-primary text-primary-contrast" />
        <text x="24" y="14" textAnchor="middle" className="font-mono text-[10px] font-bold fill-primary-contrast">
          98% MATCH
        </text>
        <line x1="4" y1="26" x2="44" y2="26" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="33" x2="36" y2="33" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Lens reflection arc */}
      <path
        d="M62 72 C70 60, 84 54, 100 54"
        stroke="var(--primary-contrast)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </g>
  </svg>
);
