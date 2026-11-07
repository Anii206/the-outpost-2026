import React from 'react';

/**
 * PaperGrain provides a subtle authentic letterpress paper grain texture overlay.
 * Uses an inline SVG feTurbulence filter at 4.5% opacity in light mode and 2.5% in dark mode.
 * Set to pointer-events-none and fixed to avoid scroll performance costs.
 */
export const PaperGrain: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none opacity-[0.045] dark:opacity-[0.025]"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="grantly-paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grantly-paper-grain)" />
      </svg>
    </div>
  );
};
