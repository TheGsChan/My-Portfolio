import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';

const SMOOTH_TAU   = 0.25;
const MIN_COPIES   = 2;
const COPY_HEADROOM = 2;

const toCssLength = v => (typeof v === 'number' ? `${v}px` : (v ?? undefined));

export const LogoLoop = memo(({
  logos,
  speed       = 120,
  direction   = 'left',
  width       = '100%',
  logoHeight  = 80,
  gap         = 80,
  pauseOnHover = true,
  hoverSpeed,
  fadeOut     = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel   = 'Tool logos',
  className,
  style
}) => {
  const containerRef = useRef(null);
  const trackRef     = useRef(null);
  const seqRef       = useRef(null);

  // ── All animation state in refs (never cause re-renders) ─────────
  const seqSizeRef     = useRef(0);
  const targetVelRef   = useRef(0);
  const hoverSpeedRef  = useRef(undefined);
  const isHoveredRef   = useRef(false);
  const rafRef         = useRef(null);
  const lastTsRef      = useRef(null);
  const offsetRef      = useRef(0);
  const velRef         = useRef(0);

  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const isVertical = direction === 'up' || direction === 'down';

  // ── Keep velocity ref in sync ─────────────────────────────────────
  useEffect(() => {
    const mag     = Math.abs(speed);
    const dirMult = isVertical
      ? (direction === 'up'   ? 1 : -1)
      : (direction === 'left' ? 1 : -1);
    targetVelRef.current = mag * dirMult * (speed < 0 ? -1 : 1);
  }, [speed, direction, isVertical]);

  // ── Keep hover-speed ref in sync ──────────────────────────────────
  useEffect(() => {
    if      (hoverSpeed !== undefined) hoverSpeedRef.current = hoverSpeed;
    else if (pauseOnHover === true)    hoverSpeedRef.current = 0;
    else                               hoverSpeedRef.current = undefined;
  }, [hoverSpeed, pauseOnHover]);

  // ── Single perpetual rAF loop (empty deps → runs once, zero jitter) ─
  useEffect(() => {
    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.max(0, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const target = (isHoveredRef.current && hoverSpeedRef.current !== undefined)
        ? hoverSpeedRef.current
        : targetVelRef.current;

      const ease = 1 - Math.exp(-dt / SMOOTH_TAU);
      velRef.current += (target - velRef.current) * ease;

      const seqSize = seqSizeRef.current;
      if (seqSize > 0) {
        let next = offsetRef.current + velRef.current * dt;
        next = ((next % seqSize) + seqSize) % seqSize;
        offsetRef.current = next;

        const track = trackRef.current;
        if (track) {
          track.style.transform = isVertical
            ? `translate3d(0,${-next}px,0)`
            : `translate3d(${-next}px,0,0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current    = null;
      lastTsRef.current = null;
    };
  }, []); // ← empty: loop never restarts, no jitter

  // ── Dimension measurement — use offsetWidth (CSS px, not scaled) ──
  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    const seq       = seqRef.current;
    if (!container || !seq) return;

    if (isVertical) {
      const parentH  = container.parentElement?.clientHeight ?? 0;
      const seqH     = seq.offsetHeight;
      if (seqH > 0 && parentH > 0) {
        seqSizeRef.current = seqH;
        const copies = Math.ceil(parentH / seqH) + COPY_HEADROOM;
        setCopyCount(c => { const n = Math.max(MIN_COPIES, copies); return c === n ? c : n; });
      }
    } else {
      const containerW = container.clientWidth;
      const seqW       = seq.offsetWidth;   // design-space px — consistent with clientWidth
      if (seqW > 0) {
        seqSizeRef.current = seqW;
        const copies = Math.ceil(containerW / seqW) + COPY_HEADROOM;
        setCopyCount(c => { const n = Math.max(MIN_COPIES, copies); return c === n ? c : n; });
      }
    }
  }, [isVertical]);

  // ── ResizeObserver ────────────────────────────────────────────────
  useEffect(() => {
    const els = [containerRef.current, seqRef.current].filter(Boolean);
    if (!window.ResizeObserver) {
      window.addEventListener('resize', updateDimensions);
      updateDimensions();
      return () => window.removeEventListener('resize', updateDimensions);
    }
    const observers = els.map(el => {
      const o = new ResizeObserver(updateDimensions);
      o.observe(el);
      return o;
    });
    updateDimensions();
    return () => observers.forEach(o => o.disconnect());
  }, [updateDimensions]);

  // ── Image load detection ──────────────────────────────────────────
  useEffect(() => {
    const images = Array.from(seqRef.current?.querySelectorAll('img') ?? []);
    if (!images.length) { updateDimensions(); return; }
    let remaining = images.length;
    const onLoad = () => { if (--remaining === 0) updateDimensions(); };
    images.forEach(img => {
      if (img.complete) onLoad();
      else {
        img.addEventListener('load',  onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true });
      }
    });
    return () => images.forEach(img => {
      img.removeEventListener('load',  onLoad);
      img.removeEventListener('error', onLoad);
    });
  }, [logos, updateDimensions]);

  // ── Mouse handlers ────────────────────────────────────────────────
  const handleMouseEnter = useCallback(() => {
    if (hoverSpeedRef.current !== undefined) isHoveredRef.current = true;
  }, []);
  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
  }, []);

  // ── Item renderer ─────────────────────────────────────────────────
  const renderLogoItem = useCallback((item, key) => {
    if (renderItem) {
      return <li className="logoloop__item" key={key} role="listitem">{renderItem(item, key)}</li>;
    }
    const isNode = 'node' in item;
    const content = isNode ? (
      <span className="logoloop__node">{item.node}</span>
    ) : (
      <img
        src={item.src} srcSet={item.srcSet} sizes={item.sizes}
        width={item.width} height={item.height}
        alt={item.alt ?? ''} title={item.title}
        loading="lazy" decoding="async" draggable={false}
      />
    );
    const wrapped = item.href ? (
      <a className="logoloop__link" href={item.href}
         aria-label={item.alt ?? item.title ?? 'logo link'}
         target="_blank" rel="noreferrer noopener">{content}</a>
    ) : content;
    return <li className="logoloop__item" key={key} role="listitem">{wrapped}</li>;
  }, [renderItem]);

  // ── List copies ───────────────────────────────────────────────────
  const logoLists = useMemo(() =>
    Array.from({ length: copyCount }, (_, i) => (
      <ul className="logoloop__list" key={`c-${i}`}
          role="list" aria-hidden={i > 0}
          ref={i === 0 ? seqRef : undefined}>
        {logos.map((item, j) => renderLogoItem(item, `${i}-${j}`))}
      </ul>
    )),
  [copyCount, logos, renderLogoItem]);

  // ── Container style ───────────────────────────────────────────────
  const containerStyle = useMemo(() => ({
    '--logoloop-gap':        `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
    width: isVertical
      ? (toCssLength(width) === '100%' ? undefined : toCssLength(width))
      : (toCssLength(width) ?? '100%'),
    ...style
  }), [gap, logoHeight, fadeOutColor, width, style, isVertical]);

  const rootClass = [
    'logoloop',
    isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
    fadeOut      && 'logoloop--fade',
    scaleOnHover && 'logoloop--scale-hover',
    className
  ].filter(Boolean).join(' ');

  return (
    <div ref={containerRef} className={rootClass} style={containerStyle}
         role="region" aria-label={ariaLabel}>
      <div className="logoloop__track" ref={trackRef}
           onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {logoLists}
      </div>
    </div>
  );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;
