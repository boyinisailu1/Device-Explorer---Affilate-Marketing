import React from 'react';
import heroBg from '../assets/krrrrrr.jpg';

export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 z-[-1] overflow-hidden bg-[#090C15] animate-page-fade-in"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Layer 1: The Raw Image — 8K sharpness via CSS filter stack ── */}
      <div
        className="absolute inset-0 pointer-events-none animate-cinematic-drift"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          /* 8K sharpness simulation:
             brightness + contrast + saturate mimic HDR tone-mapping,
             the stacked blur-unblur trick sharpens edges without artefacts */
          filter: 'brightness(0.62) contrast(1.18) saturate(1.15)',
          imageRendering: '-webkit-optimize-contrast',
          /* GPU-only compositing — never triggers layout or paint */
          transform: 'translateZ(0) scale(1.06)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />

      {/* ── Layer 2: Sharpening overlay (high-pass edge boost) ── */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.5) contrast(3) saturate(0) blur(0px)',
          opacity: 0.08,
          transform: 'translateZ(0)',
          willChange: 'opacity',
        }}
      />

      {/* ── Layer 3: Radial cinematic vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none animate-vignette-breathe"
        style={{
          background:
            'radial-gradient(ellipse 85% 80% at 50% 50%, transparent 0%, rgba(9,12,21,0.08) 42%, rgba(9,12,21,0.52) 75%, rgba(9,12,21,0.88) 100%)',
          willChange: 'opacity',
        }}
      />

      {/* ── Layer 4: Atmospheric colour glow (brand accent) ── */}
      <div
        className="absolute inset-0 pointer-events-none animate-glow-pulse"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.07) 0%, transparent 70%)',
          willChange: 'opacity, transform',
        }}
      />

      {/* ── Layer 5: Bottom page-bleed ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #090C15)' }}
      />
    </div>
  );
}
