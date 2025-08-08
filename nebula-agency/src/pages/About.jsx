import { motion } from 'framer-motion'

const stats = [
  { label: 'Projects launched', value: 120 },
  { label: 'Avg. ROI increase', value: 214, suffix: '%' },
  { label: 'Client NPS', value: 72 },
]

function Counter({ value, suffix = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
    >
      {value}{suffix}
    </motion.span>
  )
}

export default function About() {
  return (
    <section className="section container">
      <div className="badge">About</div>
      <h2 className="display">We blend design, code, and cosmos</h2>
      <p className="subtitle">Our distributed team combines senior designers, engineers, and strategists to craft products that feel effortless.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22, marginTop: 32 }}>
        {stats.map((s, i) => (
          <motion.div className="card" key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: 20 }}>
            <h2 style={{ fontSize: 42, margin: 0 }}><Counter value={s.value} suffix={s.suffix} /></h2>
            <p className="subtitle" style={{ margin: 0 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}