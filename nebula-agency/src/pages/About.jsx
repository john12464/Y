import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiZap, FiUsers, FiGlobe, FiAward, FiTrendingUp, FiHeart } from 'react-icons/fi'

const stats = [
  { label: 'Custom build', value: 100, suffix: '%' },
  { label: 'Avg. ROI increase', value: 65, suffix: '%' },
  { label: 'Client NPS', value: 50 },
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
              Nebula Agency was created from a simple belief: digital experiences should be just as beautiful as they are functional. Our focus is on building solutions that balance design, technology, and performance in ways that truly serve our clients. 
            </p>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              Over time, we’ve had the privilege of working with a wide variety of clients—from local startups and community organizations to established companies exploring new ways to connect online. Each collaboration has shaped our journey and strengthened our commitment to delivering digital work that makes a real difference.
            </p>
            <p className="subtitle">
              Our approach is built on blending modern tools with timeless design principles. We don’t chase trends for the sake of novelty; instead, we focus on creating solutions that feel innovative today while remaining effective and adaptable tomorrow.
            </p>
          </div>
          <div>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              We specialize in user experience design, front-end development, back-end architecture, and digital strategy. This combination allows us to approach projects from multiple perspectives and ensure that the final result is not only visually engaging but also reliable and scalable.
            </p>
            <p className="subtitle" style={{ marginBottom: 16 }}>
              Whether you’re looking for a refreshed brand identity, a custom website, or improvements to your existing digital platforms, we provide thoughtful, tailored solutions designed to meet your specific needs.
            </p>
            <p className="subtitle">
              At Nebula, we believe the best work comes from collaboration. Every project is a partnership, and we place transparency, communication, and shared vision at the center of our process. By working closely with our clients, we ensure that the final outcome reflects both their goals and our dedication to craft.
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
