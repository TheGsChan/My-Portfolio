import { useId } from "react"
import { Particles as TSParticles, ParticlesProvider } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

// Adapted from https://badtz-ui.com/r/particles.json
// TSParticles renders: <div id={id} style={style}> then injects <canvas> inside it
// So we need the outer div + inner canvas both sized to fill the parent

const variantStyles = {
  default: {
    count: 200,
    size: 2,
    speed: 1.5,
    opacity: 0.8,
    color: "#FFFFFF",
  },
  snow: {
    count: 300,
    size: 1.2,
    speed: 1,
    opacity: 0.6,
    color: "#FFFFFF",
    options: {
      interactivity: { detectOn: "canvas", events: { onHover: { enable: false } } },
      particles: {
        move: {
          enable: true,
          speed: { min: 2, max: 3 },
          direction: "bottom",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
        shape: { type: "circle" },
      },
    },
  },
  stars: {
    count: 200,
    size: 1.5,
    speed: 0,
    opacity: 0.8,
    color: "#FFFFFF",
    options: {
      interactivity: { detectOn: "canvas", events: { onHover: { enable: false } } },
      particles: {
        move: { enable: false },
        twinkle: { particles: { enable: true, frequency: 0.1, opacity: 1 } },
        shape: { type: "star" },
        shadow: { enable: true, color: "#FFFFFF", blur: 5, offset: { x: 0, y: 0 } },
      },
    },
  },
}

const deepMerge = (target, source) => {
  const output = { ...target }
  if (source) {
    Object.keys(source).forEach((key) => {
      if (source[key] instanceof Object && key in target) {
        output[key] = deepMerge(target[key], source[key])
      } else {
        output[key] = source[key]
      }
    })
  }
  return output
}

function ParticlesInner({
  variant = "default",
  particleStyle = {},
  interactive = true,
  customOptions = {},
}) {
  const id = useId()

  const baseStyle = variantStyles[variant] || variantStyles.default
  const finalStyle = { ...baseStyle, ...particleStyle }

  const defaultOptions = {
    detectRetina: true,
    fpsLimit: 120,
    interactivity: {
      detectOn: "canvas",
      events: {
        onHover: {
          enable: variant === "snow" || variant === "stars" ? false : interactive,
          mode: "repulse",
        },
      },
      modes: {
        repulse: { distance: 150, duration: 1.2, factor: 6, speed: 0.5 },
      },
    },
    particles: {
      number: { value: finalStyle.count },
      color: { value: finalStyle.color },
      opacity: {
        value: { min: (finalStyle.opacity || 0.8) / 5, max: finalStyle.opacity || 0.8 },
        animation: { enable: true, sync: false, speed: 2 },
      },
      size: {
        value: { min: (finalStyle.size || 2) / 5, max: finalStyle.size || 2 },
      },
      move: {
        enable: true,
        speed: { min: (finalStyle.speed || 1.5) / 5, max: finalStyle.speed || 1.5 },
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "out" },
      },
    },
    // Must be false — prevents tsparticles from setting canvas to 100vw/100vh
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
  }

  const variantOptions = baseStyle.options || {}
  const mergedOptions = deepMerge(defaultOptions, variantOptions)
  const finalOptions = deepMerge(mergedOptions, customOptions)

  // This style goes on the outer <div> tsparticles renders.
  // The canvas injected inside it will also match via CSS in index.js.
  const divStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 2,
  }

  return (
    <TSParticles
      id={id}
      options={finalOptions}
      style={divStyle}
    />
  )
}

async function initEngine(engine) {
  await loadSlim(engine)
}

export function Particles(props) {
  return (
    <ParticlesProvider init={initEngine}>
      <ParticlesInner {...props} />
    </ParticlesProvider>
  )
}
