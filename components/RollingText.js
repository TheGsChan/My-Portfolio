import { useEffect, useRef, useState } from 'react';

/**
 * RollingText
 * ─────────────────────────────────────────────────────────────────
 * Each character rolls up from below into place, staggered.
 * Inspired by animate-ui's RollingText primitive.
 *
 * Props
 *   text       string   Text to display
 *   delay      number   ms delay before animation starts (default 0)
 *   duration   number   ms per character animation (default 500)
 *   stagger    number   ms between each character (default 40)
 *   className  string   Class applied to the outer wrapper
 */
export function RollingText({
  text = '',
  delay = 0,
  duration = 520,
  stagger = 42,
  className = '',
}) {
  const [triggered, setTriggered] = useState(false);
  const wrapRef = useRef(null);

  // Trigger when scrolled into view (IntersectionObserver)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setTriggered(true), delay);
          observer.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const chars = text.split('');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .rt-wrap {
          display: inline-flex;
          overflow: hidden;
          vertical-align: bottom;
          line-height: 1.15;
        }
        .rt-char-clip {
          display: inline-block;
          overflow: hidden;
          line-height: 1.15;
        }
        .rt-char {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition-property: transform, opacity;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }
        .rt-char.rt-visible {
          transform: translateY(0%);
          opacity: 1;
        }
        .rt-char-space {
          display: inline-block;
          width: 0.3em;
        }
      `}} />
      <span ref={wrapRef} className={`rt-wrap ${className}`} aria-label={text}>
        {chars.map((char, i) =>
          char === ' ' ? (
            <span key={i} className="rt-char-space" aria-hidden="true" />
          ) : (
            <span key={i} className="rt-char-clip" aria-hidden="true">
              <span
                className={`rt-char${triggered ? ' rt-visible' : ''}`}
                style={{
                  transitionDuration: `${duration}ms`,
                  transitionDelay: triggered ? `${i * stagger}ms` : '0ms',
                }}
              >
                {char}
              </span>
            </span>
          )
        )}
      </span>
    </>
  );
}

export default RollingText;
