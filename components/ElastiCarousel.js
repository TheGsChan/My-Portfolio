import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * ElastiCarousel
 * ──────────────────────────────────────────────────────────────────
 * A faithful React port of the Elastislide carousel pattern.
 * Uses the same structural classes from elastislide.css:
 *   .elastislide-wrapper → .elastislide-carousel → ul > li > a > img
 * Navigation via prev / next arrow buttons.
 * Auto-slides on mount; pauses on hover.
 *
 * Props
 *   items        [{img, label, tag}]
 *   accentColor  string   accent for tag pill & nav arrows
 *   itemWidth    number   px width of each card (default 480)
 *   gap          number   px gap between cards (default 28)
 *   speed        number   ms per slide transition (default 420)
 *   autoDelay    number   ms between auto-advances (default 2800)
 */
export default function ElastiCarousel({
  items = [],
  accentColor = '#0011ff',
  itemWidth = 480,
  gap = 28,
  speed = 420,
  autoDelay = 2800,
}) {
  const listRef   = useRef(null);
  const timerRef  = useRef(null);
  const [index, setIndex] = useState(0);

  const total = items.length;
  const step  = itemWidth + gap;   // how many px one slide moves

  // ── Slide to a given index, clamped to [0 … total-1] ─────────────
  const slideTo = useCallback(i => {
    const clamped = Math.max(0, Math.min(i, total - 1));
    setIndex(clamped);
    if (listRef.current) {
      listRef.current.style.transform = `translateX(${-clamped * step}px)`;
    }
  }, [total, step]);

  const prev = useCallback(() => slideTo(index - 1), [index, slideTo]);
  const next = useCallback(() => {
    // wrap around
    slideTo(index + 1 < total ? index + 1 : 0);
    if (index + 1 >= total) setIndex(0);
  }, [index, total, slideTo]);

  // ── Auto-advance ──────────────────────────────────────────────────
  const startAuto = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % total;
        if (listRef.current) {
          listRef.current.style.transform = `translateX(${-next * step}px)`;
        }
        return next;
      });
    }, autoDelay);
  }, [total, step, autoDelay]);

  const stopAuto = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, [startAuto]);

  // Apply transform whenever index changes externally (prev/next buttons)
  useEffect(() => {
    if (listRef.current) {
      listRef.current.style.transform = `translateX(${-index * step}px)`;
    }
  }, [index, step]);

  return (
    <>
      <style>{`
        /* ── Elastislide structural styles ──────────────────────────── */
        .es-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .es-carousel {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 100%;
          padding: 0 60px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }
        /* The sliding ul — matches .elastislide-carousel ul */
        .es-carousel ul {
          position: relative;
          display: block;
          list-style-type: none;
          padding: 0;
          margin: 0;
          white-space: nowrap;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          transform: translateX(0px);
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: ${speed}ms;
          will-change: transform;
        }
        /* Items — matches .elastislide-horizontal ul li */
        .es-carousel ul li {
          display: inline-block;
          vertical-align: top;
          margin: 0;
          -webkit-backface-visibility: hidden;
          min-width: 20px;
        }
        /* Card anchor — matches .elastislide-carousel ul li a */
        .es-carousel ul li a {
          display: inline-block;
          width: 100%;
          text-decoration: none;
          position: relative;
        }
        /* Image — matches .elastislide-carousel ul li a img */
        .es-card-img {
          display: block;
          border: 2px solid rgba(255,255,255,0.18);
          max-width: 100%;
          width: 100%;
          object-fit: cover;
          border-radius: 18px;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.45s ease;
        }
        .es-carousel ul li a:hover .es-card-img {
          transform: scale(1.03) translateY(-6px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.45);
        }
        /* Tag pill */
        .es-tag {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 2px;
          padding: 4px 14px;
          border-radius: 50px;
          color: #fff;
          font-family: 'Inter', sans-serif;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.25);
          pointer-events: none;
        }
        /* Label bar */
        .es-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 18px 20px;
          font-size: 24px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          color: #fff;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%);
          letter-spacing: 0.2px;
          border-radius: 0 0 18px 18px;
        }
        /* ── Navigation arrows — matches elastislide-wrapper nav span ── */
        .es-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .es-nav button {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.28);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          cursor: pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.22s ease, transform 0.18s ease, opacity 0.22s ease;
          opacity: 0.82;
        }
        .es-nav button:hover {
          background: rgba(255,255,255,0.22);
          opacity: 1;
          transform: translateY(0) scale(1.1);
        }
        .es-nav button:active {
          transform: translateY(0) scale(0.95);
        }
        .es-nav button svg {
          pointer-events: none;
        }
        /* matches .elastislide-horizontal nav span — left side */
        .es-nav-prev { left: 8px; }
        /* matches .elastislide-horizontal nav span.elastislide-next — right */
        .es-nav-next { right: 8px; }

        /* Dot indicators */
        .es-dots {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 10;
        }
        .es-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .es-dot.active {
          background: #fff;
          transform: scale(1.35);
        }
      `}</style>

      <div
        className="es-wrapper"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        {/* ── Prev arrow — elastislide-horizontal nav span ── */}
        <div className="es-nav es-nav-prev">
          <button
            onClick={prev}
            aria-label="Previous"
            disabled={index === 0}
            style={{ opacity: index === 0 ? 0.3 : 0.82 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* ── elastislide-carousel ── */}
        <div className="es-carousel">
          {/* ul — elastislide-carousel ul */}
          <ul ref={listRef}>
            {items.map((item, i) => (
              <li
                key={i}
                style={{ width: itemWidth, marginRight: i < items.length - 1 ? gap : 0 }}
              >
                {/* a — elastislide-carousel ul li a */}
                <a href="#" onClick={e => e.preventDefault()}>
                  {/* img — elastislide-carousel ul li a img */}
                  <img
                    src={item.img}
                    alt={item.label}
                    className="es-card-img"
                    style={{ height: '100%', maxHeight: '100%' }}
                    loading="lazy"
                  />
                  <span
                    className="es-tag"
                    style={{ background: `${accentColor}99` }}
                  >
                    {item.tag}
                  </span>
                  <div className="es-label">{item.label}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Next arrow — elastislide-horizontal nav span.elastislide-next ── */}
        <div className="es-nav es-nav-next">
          <button onClick={next} aria-label="Next">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* ── Dot navigation ── */}
        <div className="es-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`es-dot${i === index ? ' active' : ''}`}
              onClick={() => slideTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={i === index ? { background: accentColor } : {}}
            />
          ))}
        </div>
      </div>
    </>
  );
}
