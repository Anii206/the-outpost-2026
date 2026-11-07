import type { Options } from 'canvas-confetti';

export async function fireAwardedConfetti() {
  if (typeof window === 'undefined') return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Dynamic import of canvas-confetti so it is split into its own chunk
  const { default: confetti } = await import('canvas-confetti');

  // Elegant broadsheet celebration burst in forest green, warm amber, and cream
  const count = 70;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#1F4D3A', '#D9401F', '#FBF8F1', '#7FBF9E', '#E2DDD2'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
