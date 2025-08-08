import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiZap, FiLayers, FiTrendingUp } from 'react-icons/fi'
import Galaxy from '../effects/Galaxy.jsx'

const features = [
  { icon: <FiZap />, title: 'Motion-first Design', text: 'Micro-interactions and cinematic transitions that feel alive.' },
  { icon: <FiLayers />, title: 'Full-stack Craft', text: 'From brand to build: design systems, web apps, and content.' },
  { icon: <FiTrendingUp />, title: 'Growth-driven', text: 'Performance, SEO, and analytics woven into the experience.' },
]

export default function Home() {
  return (
    <div>
      <section className="section container">
        <div className="hero-stack card" style={{ position: 'relative', minHeight: '56vh', display: 'grid', placeItems: 'center', padding: '48px', overflow: 'hidden' }}>
          <Galaxy hueShift={220} density={1.2} twinkleIntensity={0.35} glowIntensity={0.35} rotationSpeed={0.05} style={{ borderRadius: 'var(--radius-lg)' }} />
          <div className="hero" style={{ position: 'relative', zIndex: 2 }}>
            <div className="badge">Futuristic Digital Agency</div>
            <h1 className="display">Build experiences that feel out of this world</h1>
            <p className="subtitle">Nebula Agency crafts immersive brands and websites with motion, precision, and a touch of stardust.</p>
            <div className="hero-cta">
              <Link className="btn primary" to="/contact">Start a Project</Link>
              <Link className="btn" to="/why-choose-us">Why choose us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <hr className="divider" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px', marginTop: '28px' }}>
          {features.map((f, i) => (
            <motion.div
              className="card"
              key={f.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{ padding: 20 }}
            >
              <div className="badge" style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,.8)' }}>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}