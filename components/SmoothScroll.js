import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * SmoothScroll — butter-smooth virtual scroll using GSAP ticker + lerp.
 * 
 * Exposes window.__tearClamp = { active: false, clampY: 0 }
 * When active is true, the scroller freezes at clampY so the tear animation
 * can use the "extra" scroll distance for its own scrubbing.
 */
export default function SmoothScroll({ children, ease = 0.08 }) {
  const wrapperRef = useRef(null)
  const contentRef = useRef(null)
  const currentY = useRef(0)
  const targetY = useRef(0)
  const rafId = useRef(null)
  const resizeObserver = useRef(null)
  const parallaxNodes = useRef([])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    // Find all Djingo & Geisha titles for parallax after layout settles
    setTimeout(() => {
      const allText = Array.from(document.querySelectorAll('[class*="text-elm"]'));
      parallaxNodes.current = allText.filter(el => {
        const ff = window.getComputedStyle(el).fontFamily.toLowerCase();
        return ff.includes('djingo') || ff.includes('geisha');
      }).map(el => {
        const ff = window.getComputedStyle(el).fontFamily.toLowerCase();
        const rect = el.getBoundingClientRect();
        const absCenter = rect.top + currentY.current + (rect.height / 2);
        // Positive speeds ensure the text moves UPWARD relative to the page when scrolling down.
        // Different values (0.08 and 0.04) keep the depth separation intact.
        const speed = ff.includes('djingo') ? 0.08 : 0.04;
        return { el, absCenter, speed };
      });
    }, 500);

    // Expose clamp interface globally so tear animation can control it
    window.__tearClamp = { active: false, clampY: 0 };

    // –– Set body/html height so the native scrollbar reflects full content ––
    const setBodyHeight = () => {
      const h = content.getBoundingClientRect().height
      document.body.style.height = h + 'px'
    }
    setBodyHeight()

    // Watch for content size changes (images loading, etc.)
    resizeObserver.current = new ResizeObserver(setBodyHeight)
    resizeObserver.current.observe(content)

    // –– Track native scroll target ––
    const onScroll = () => {
      // When tear clamp is active, don't update targetY — let the clamp control position
      if (window.__tearClamp?.active) return;
      targetY.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // –– GSAP ticker drives the interpolation ––
    const lerp = (a, b, t) => a + (b - a) * t

    let wasClampActive = false;

    const tick = () => {
      const clamp = window.__tearClamp;
      const isClampActive = clamp?.active === true;

      // On the frame the clamp releases: sync targetY to window.scrollY
      // so lerp picks up from the right destination. Do NOT touch currentY —
      // leaving it at the frozen position lets it ease forward smoothly.
      if (wasClampActive && !isClampActive) {
        targetY.current = window.scrollY;
      }
      wasClampActive = isClampActive;

      const effectiveTarget = isClampActive ? clamp.clampY : targetY.current;

      currentY.current = lerp(currentY.current, effectiveTarget, ease)

      if (Math.abs(currentY.current - effectiveTarget) < 0.05) {
        currentY.current = effectiveTarget
      }

      gsap.set(content, { y: -currentY.current, force3D: true })

      // Apply Parallax based on distance from Viewport Center
      // This ensures offset is exactly 0 when the element is centered on screen!
      const vpCenter = window.innerHeight / 2;
      for (let i = 0; i < parallaxNodes.current.length; i++) {
        const { el, absCenter, speed } = parallaxNodes.current[i];
        const visualCenter = absCenter - currentY.current;
        const distanceFromCenter = visualCenter - vpCenter;
        gsap.set(el, { y: distanceFromCenter * speed, force3D: true });
      }
    }

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0) // Disable lag smoothing for consistent frame pacing

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('scroll', onScroll)
      resizeObserver.current?.disconnect()
      document.body.style.height = ''
      delete window.__tearClamp;
    }
  }, [ease])

  return (
    <>
      {/* Fixed viewport wrapper */}
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Scrolling content */}
        <div ref={contentRef} style={{ willChange: 'transform' }}>
          {children}
        </div>
      </div>

      {/* Spacer that gives the scrollbar its range */}
      <div aria-hidden="true" style={{ pointerEvents: 'none' }} />
    </>
  )
}
