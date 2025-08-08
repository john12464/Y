import { useMemo, useCallback } from 'react'
import { loadFull } from 'tsparticles'
import Particles from 'react-tsparticles'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'

export default function ParticlesBackground({ disabled = false }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isOff = disabled || prefersReducedMotion
  const options = useMemo(() => ({
    fullScreen: { enable: true, zIndex: 0 },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      number: { value: 60, density: { enable: true, area: 900 } },
      color: { value: ['#B18CFF', '#89AFFF', '#ff4fa2'] },
      links: { enable: true, distance: 120, color: '#6f61c7', opacity: 0.25, width: 1 },
      move: { enable: true, speed: 0.6, outModes: { default: 'out' } },
      opacity: { value: { min: 0.2, max: 0.6 } },
      size: { value: { min: 1, max: 3 } },
      twinkle: { particles: { enable: true, color: { value: '#ffffff' }, frequency: 0.02, opacity: 0.4 } },
      shadow: { enable: true, color: '#B18CFF', blur: 2 }
    },
    detectRetina: true,
  }), [])

  const init = useCallback(async (engine) => {
    await loadFull(engine)
  }, [])

  if (isOff) return null
  return <Particles id="tsparticles" init={init} options={options} />
}