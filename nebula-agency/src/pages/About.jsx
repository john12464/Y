import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiZap, FiUsers, FiGlobe, FiAward, FiTrendingUp, FiHeart } from 'react-icons/fi'

const stats = [
  { label: 'Projects launched', value: 120 },
  { label: 'Avg. ROI increase', value: 214, suffix: '%' },
  { label: 'Client NPS', value: 72 },
]

const values = [
  { icon: <FiZap />, title: 'Innovation First', description: 'We push boundaries with cutting-edge technologies and creative solutions that set new industry standards.' },
  { icon: <FiUsers />, title: 'Collaborative Excellence', description: 'Our distributed team of experts works seamlessly together to deliver exceptional results.' },
  { icon: <FiGlobe />, title: 'Global Perspective', description: 'We bring diverse perspectives and international best practices to every project we undertake.' },
  { icon: <FiAward />, title: 'Quality Assurance', description: 'Every project undergoes rigorous testing and quality checks to ensure flawless delivery.' },
  { icon: <FiTrendingUp />, title: 'Growth Focused', description: 'We don\'t just build websites; we create digital experiences that drive measurable business growth.' },
  { icon: <FiHeart />, title: 'Client Partnership', description: 'We believe in long-term partnerships, treating your success as our own mission.' },
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
    <div>
      <section className="section container">
        <div className="badge">About</div>
        <h2 className="display">We blend design, code, and cosmos</h2>
        <p className="subtitle">Our distributed team combines senior designers, engineers, and strategists to craft products that feel effortless and deliver exceptional results.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 22, marginTop: 32 }}>
          {stats.map((s, i) => (
            <motion.div className="card" key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ padding: 20 }}>
              <h2 style={{ fontSize: 42, margin: 0 }}><Counter value={s.value} suffix={s.suffix} /></h2>
              <p className="subtitle" style={{ margin: 0 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="badge">Our Story</div>
        <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>From vision to reality</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginTop: 32 }}>
          <div>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              Founded in 2020, Nebula Agency emerged from a simple belief: that digital experiences should be as beautiful as they are functional. Our journey began with a small team of passionate designers and developers who shared a vision of creating websites that not only look stunning but also perform exceptionally.
            </p>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              Today, we've grown into a full-service digital agency serving clients across the globe. From startups to Fortune 500 companies, we've helped businesses of all sizes establish powerful digital presences that drive real results.
            </p>
            <p className="subtitle">
              Our approach combines cutting-edge technology with timeless design principles, ensuring that every project we deliver is both innovative and enduring.
            </p>
          </div>
          <div>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              We specialize in creating immersive digital experiences that captivate audiences and drive conversions. Our team brings together expertise in user experience design, front-end development, back-end architecture, and digital strategy.
            </p>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              Whether you need a complete brand overhaul, a custom web application, or a performance optimization strategy, we have the skills and experience to bring your vision to life.
            </p>
            <p className="subtitle">
              We believe in the power of collaboration and transparency. Every project is a partnership, and we work closely with our clients to ensure their vision is realized exactly as they imagined it.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="badge">Our Values</div>
        <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>What drives us forward</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, marginTop: 32 }}>
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ padding: 24 }}
            >
              <div className="badge" style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', marginBottom: 16 }}>{value.icon}</div>
              <h3 style={{ marginBottom: 12, fontSize: '1.4rem' }}>{value.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="cta">
          <h2 className="display" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>Ready to work together?</h2>
          <p className="subtitle">Let's discuss how we can help bring your vision to life.</p>
          <div className="hero-cta">
            <Link className="btn primary" to="/contact">Start a Project</Link>
            <Link className="btn" to="/why-choose-us">Why Choose Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}