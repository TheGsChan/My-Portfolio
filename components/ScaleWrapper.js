import { useEffect, useRef, useState } from 'react'

/**
 * ScaleWrapper — scales an absolutely-positioned canvas-style page
 * to fit the current viewport width, then sets the document height
 * so scrolling covers the full scaled content.
 *
 * Locked Settings: Zoom 1.85x, Offset X -140px
 */
export default function ScaleWrapper({ children, designWidth = 3537.33, designHeight = 17839.6 }) {
  const [scale, setScale] = useState(1)
  const outerRef = useRef(null)

  // Locked values from user confirmation
  const multiplier = 1.85;
  const offsetX = -140; // pixels

  useEffect(() => {
    const compute = () => {
      const vw = document.documentElement.clientWidth || window.innerWidth
      const s = (vw / designWidth) * multiplier
      setScale(s)
      
      if (outerRef.current) {
        outerRef.current.style.height = designHeight * s + 'px'
      }
    }

    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [designWidth, designHeight])

  return (
    <div
      id="scale-wrapper-outer"
      ref={outerRef}
      style={{
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        // Outer wrapper spans 100% of the screen. No transform here, 
        // which prevents exposing the page background.
      }}
    >
      <div
        style={{
          position: 'relative',
          transformOrigin: 'top left',
          // Apply the X offset before scaling so it acts as screen pixels.
          // translateX moves the canvas left/right exactly on screen.
          transform: `translateX(${offsetX}px) scale(${scale})`,
          width: designWidth + 'px',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
