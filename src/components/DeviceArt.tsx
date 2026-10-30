import { useId } from "react";
import type { ArtKind, CategoryId } from "../data/catalog.ts";

const tones: Record<CategoryId, { bg: string; fg: string; accent: string; ink: string }> = {
  lorawan: { bg: "#d7ebe3", fg: "#12382c", accent: "#e07a45", ink: "#f7f4ee" },
  "lte-m": { bg: "#d9e4f2", fg: "#1a365d", accent: "#e07a45", ink: "#f4f7fb" },
  "nb-iot": { bg: "#f3e2d2", fg: "#6a3b16", accent: "#1f6f5b", ink: "#fff8f2" },
  "passerelles-lorawan": { bg: "#e4e7ee", fg: "#1c2430", accent: "#d4532b", ink: "#f4f6f8" },
  "passerelles-iot": { bg: "#e8e3f2", fg: "#2d2640", accent: "#d4532b", ink: "#f7f5fb" },
  modules: { bg: "#efe6d4", fg: "#243528", accent: "#c6a15b", ink: "#f8f1e4" },
};

export function DeviceArt({
  art,
  category,
  label,
  large = false,
  small = false,
}: {
  art: ArtKind;
  category: CategoryId;
  label: string;
  large?: boolean;
  small?: boolean;
}) {
  const tone = tones[category];
  const rawId = useId().replace(/:/g, "");
  const size = large ? "art art-lg" : small ? "art art-sm" : "art";

  return (
    <div className={size} style={{ background: tone.bg }} aria-hidden="true">
      <svg viewBox="0 0 360 240">
        <defs>
          <pattern id={rawId} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill={tone.fg} opacity="0.18" />
          </pattern>
        </defs>
        <rect width="360" height="240" fill={`url(#${rawId})`} />
        {art === "node" && <Node tone={tone} />}
        {art === "puck" && <Puck tone={tone} />}
        {art === "gateway" && <Gateway tone={tone} />}
        {art === "pcb" && <Pcb tone={tone} />}
        {!small && !large && (
          <text
            x="180"
            y="222"
            textAnchor="middle"
            fill={tone.fg}
            opacity="0.72"
            fontSize="12"
            fontFamily="Source Sans 3, sans-serif"
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

function Node({ tone }: { tone: (typeof tones)[CategoryId] }) {
  return (
    <g>
      <ellipse cx="180" cy="176" rx="78" ry="8" fill={tone.fg} opacity="0.12" />
      <line x1="180" y1="58" x2="180" y2="28" stroke={tone.fg} strokeWidth="3" strokeLinecap="round" />
      <circle cx="180" cy="24" r="5" fill={tone.accent} />
      <rect x="108" y="64" width="144" height="104" rx="22" fill={tone.fg} />
      <rect x="124" y="82" width="78" height="42" rx="8" fill={tone.ink} opacity="0.9" />
      <circle cx="224" cy="92" r="5" fill={tone.accent} />
      <circle cx="128" cy="150" r="3" fill={tone.ink} opacity="0.45" />
      <circle cx="232" cy="150" r="3" fill={tone.ink} opacity="0.45" />
    </g>
  );
}

function Puck({ tone }: { tone: (typeof tones)[CategoryId] }) {
  return (
    <g>
      <ellipse cx="180" cy="176" rx="70" ry="8" fill={tone.fg} opacity="0.12" />
      <circle cx="180" cy="112" r="62" fill={tone.fg} />
      <circle cx="180" cy="112" r="40" fill="none" stroke={tone.ink} strokeWidth="3" opacity="0.45" />
      <circle cx="180" cy="112" r="8" fill={tone.accent} />
      <rect x="168" y="46" width="24" height="10" rx="4" fill={tone.fg} />
    </g>
  );
}

function Gateway({ tone }: { tone: (typeof tones)[CategoryId] }) {
  return (
    <g>
      <ellipse cx="180" cy="188" rx="110" ry="8" fill={tone.fg} opacity="0.12" />
      <line x1="132" y1="62" x2="120" y2="28" stroke={tone.fg} strokeWidth="3" strokeLinecap="round" />
      <line x1="228" y1="62" x2="240" y2="28" stroke={tone.fg} strokeWidth="3" strokeLinecap="round" />
      <circle cx="118" cy="24" r="4" fill={tone.accent} />
      <circle cx="242" cy="24" r="4" fill={tone.accent} />
      <rect x="78" y="68" width="204" height="108" rx="16" fill={tone.fg} />
      <rect x="96" y="86" width="120" height="46" rx="6" fill={tone.ink} opacity="0.14" />
      <circle cx="250" cy="96" r="4" fill="#7dcea0" />
      <circle cx="250" cy="112" r="4" fill={tone.accent} />
      <rect x="96" y="148" width="28" height="10" rx="2" fill={tone.ink} opacity="0.35" />
      <rect x="132" y="148" width="28" height="10" rx="2" fill={tone.ink} opacity="0.35" />
    </g>
  );
}

function Pcb({ tone }: { tone: (typeof tones)[CategoryId] }) {
  return (
    <g>
      <rect x="78" y="42" width="204" height="150" rx="10" fill={tone.fg} />
      <path
        d="M110 70h70M110 90h40M168 90h48M110 120h90M150 140h60"
        stroke={tone.accent}
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      <rect x="196" y="78" width="52" height="40" rx="4" fill="#141816" />
      <rect x="204" y="86" width="36" height="8" rx="1" fill={tone.accent} opacity="0.8" />
      {Array.from({ length: 7 }, (_, index) => (
        <rect
          key={index}
          x="92"
          y={58 + index * 16}
          width="10"
          height="6"
          rx="1"
          fill={tone.accent}
        />
      ))}
    </g>
  );
}
