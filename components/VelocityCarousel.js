'use client';
import { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
} from 'framer-motion';

/**
 * VelocityCarousel
 * ─────────────────────────────────────────────────────────────────
 * A horizontal, auto-scrolling strip of 3D cards whose tilt and
 * Y-offset are driven by the user's scroll velocity — the faster
 * you scroll the page, the more the cards wave in 3D space.
 *
 * Props
 *   items        [{img, label, tag}]   card data (will be duplicated)
 *   accentColor  string                CSS color for tag & glow
 *   direction    'ltr' | 'rtl'        auto-scroll direction
 *   speed        number               px/s base scroll speed (default 80)
 *   baseRotate   number               max rotateY in degrees at peak velocity (default 18)
 *   waveAmp      number               max translateY wave amplitude in px (default 60)
 */
export default function VelocityCarousel({
  items = [],
  accentColor = '#0011ff',
  direction = 'ltr',
  speed = 80,
  baseRotate = 18,
  waveAmp = 60,
}) {
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const hovering = useRef(false);
  const dirMultiplier = direction === 'rtl' ? -1 : 1;

  // ── scroll velocity ─────────────────────────────────────────────
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);

  // smooth + clamp: ±1 at max scroll speed ~1200 px/s
  const smoothVelocity = useSpring(rawVelocity, { stiffness: 400, damping: 50 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 1200], [-1, 1]);

  // ── auto-scroll loop ─────────────────────────────────────────────
  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const halfWidth = track.scrollWidth / 2;

    if (!hovering.current) {
      xRef.current -= (speed * dirMultiplier * delta) / 1000;
    }

    // seamless loop
    if (dirMultiplier > 0 && xRef.current <= -halfWidth) xRef.current += halfWidth;
    if (dirMultiplier < 0 && xRef.current >= 0) xRef.current -= halfWidth;

    track.style.transform = `translateX(${xRef.current}px)`;
  });

  // ── doubled items for seamless loop ────────────────────────────
  const doubled = [...items, ...items];

  return (
    <div
      className="vc-wrap"
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <div ref={trackRef} className="vc-track">
        {doubled.map((item, i) => (
          <VelocityCard
            key={i}
            item={item}
            index={i}
            total={doubled.length}
            velocityFactor={velocityFactor}
            accentColor={accentColor}
            baseRotate={baseRotate}
            waveAmp={waveAmp}
            dirMultiplier={dirMultiplier}
          />
        ))}
      </div>

      <style>{`
        .vc-wrap {
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          perspective: 1800px;
        }
        .vc-track {
          display: flex;
          gap: 32px;
          padding: 48px 40px;
          width: max-content;
          will-change: transform;
        }
        .vc-card {
          flex: 0 0 auto;
          width: 480px;
          height: 820px;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: #0a0a0a;
          cursor: pointer;
          transform-style: preserve-3d;
          box-shadow: 0 6px 40px rgba(0,0,0,0.35);
          transition: box-shadow 0.3s ease;
        }
        .vc-card:hover {
          box-shadow: 0 20px 70px rgba(0,0,0,0.55);
        }
        .vc-card__img {
          width: 100%;
          height: 680px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .vc-card:hover .vc-card__img {
          transform: scale(1.06);
        }
        .vc-card__tag {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 2.5px;
          padding: 5px 16px;
          border-radius: 50px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255,255,255,0.30);
          pointer-events: none;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .vc-card__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 22px 24px;
          font-size: 28px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          color: #fff;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 100%);
          letter-spacing: 0.3px;
        }
        .vc-card__shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.06) 0%,
            transparent 50%,
            rgba(0,0,0,0.08) 100%
          );
          pointer-events: none;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

function VelocityCard({
  item,
  index,
  total,
  velocityFactor,
  accentColor,
  baseRotate,
  waveAmp,
  dirMultiplier,
}) {
  const cardRef = useRef(null);

  // Each card gets a phase offset so they form a wave
  const phase = (index / total) * Math.PI * 2;

  // rotateY: velocity × baseRotate, modulated by card phase
  const rotateY = useTransform(velocityFactor, (v) => {
    return v * baseRotate * Math.cos(phase) * dirMultiplier;
  });

  // translateY: velocity × waveAmp, creates staggered wave
  const y = useTransform(velocityFactor, (v) => {
    return v * waveAmp * Math.sin(phase + Math.PI / 4);
  });

  // scale: slight shrink mid-wave for depth illusion
  const scale = useTransform(velocityFactor, [-1, 0, 1], [0.92, 1, 0.92]);

  return (
    <motion.div
      ref={cardRef}
      className="vc-card"
      style={{
        rotateY,
        y,
        scale,
        borderColor: `${accentColor}22`,
        border: `2px solid ${accentColor}22`,
      }}
      whileHover={{
        scale: 1.04,
        y: -10,
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <img src={item.img} alt={item.label} className="vc-card__img" loading="lazy" />
      <span
        className="vc-card__tag"
        style={{ background: `${accentColor}55` }}
      >
        {item.tag}
      </span>
      <div className="vc-card__label">{item.label}</div>
      <div className="vc-card__shine" />
    </motion.div>
  );
}
