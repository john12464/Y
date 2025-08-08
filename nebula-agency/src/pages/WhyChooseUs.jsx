import { motion } from 'framer-motion'
import { FiCode, FiFeather, FiShield, FiCpu, FiCompass, FiHeart } from 'react-icons/fi'

const items = [
  { icon: <FiFeather />, title: 'Brand Craft', text: 'Visual identities with luminous gradients and editorial type.' },
  { icon: <FiCode />, title: 'Engineering', text: 'Type-safe, fast, accessible builds with modern stacks.' },
  { icon: <FiShield />, title: 'Reliability', text: 'Best practices, testing, and monitoring baked in.' },
  { icon: <FiCpu />, title: 'Performance', text: 'Core Web Vitals passing, optimized assets, smart caching.' },
  { icon: <FiCompass />, title: 'Strategy', text: 'From discovery to launch, we align on measurable outcomes.' },
  { icon: <FiHeart />, title: 'Partnership', text: 'Transparent, collaborative, and long-term focused.' },
]

export default function WhyChooseUs() {
  return (
    <section className="section container">
      <div className="badge">Why choose us</div>
      <h2 className="display">Design that moves. Code that scales.</h2>
      <p className="subtitle">We blend delightful motion design with robust engineering to deliver premium results.</p>

      <div style={{ height: 18 }} />
      <hr className="divider" />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22, marginTop: 28
      }}>
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            className="card"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 16 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            style={{ padding: 20, position: 'relative', overflow: 'hidden' }}
          >
            <div className="badge" style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', marginBottom: 12 }}>{it.icon}</div>
            <h3 style={{ marginBottom: 8 }}>{it.title}</h3>
            <p style={{ color: 'rgba(255,255,255,.8)' }}>{it.text}</p>
            <div style={{ position: 'absolute', inset: -1, pointerEvents: 'none', background: 'radial-gradient(400px 200px at 20% -10%, rgba(177,140,255,0.15), transparent 60%)' }} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}