import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiCode, FiFeather, FiShield, FiCpu, FiCompass, FiHeart, FiZap, FiUsers, FiGlobe, FiAward, FiTrendingUp, FiClock } from 'react-icons/fi'

const items = [
  { icon: <FiFeather />, title: 'Brand Craft', text: 'Visual identities with luminous gradients and editorial type that capture your brand\'s essence and resonate with your audience.' },
  { icon: <FiCode />, title: 'Engineering Excellence', text: 'Type-safe, fast, accessible builds with modern stacks that ensure your website performs flawlessly across all devices.' },
  { icon: <FiShield />, title: 'Reliability & Security', text: 'Best practices, comprehensive testing, and robust monitoring baked into every project for peace of mind.' },
  { icon: <FiCpu />, title: 'Performance Optimization', text: 'Core Web Vitals passing, optimized assets, smart caching, and lightning-fast load times that keep users engaged.' },
  { icon: <FiCompass />, title: 'Strategic Approach', text: 'From discovery to launch, we align on measurable outcomes and create clear roadmaps for success.' },
  { icon: <FiHeart />, title: 'True Partnership', text: 'Transparent, collaborative, and long-term focused relationships that treat your success as our mission.' },
]

const advantages = [
  { icon: <FiZap />, title: 'Lightning Fast Delivery', description: 'Our streamlined processes and experienced team ensure your project is delivered on time, every time.' },
  { icon: <FiUsers />, title: 'Expert Team', description: 'Work with seasoned professionals who bring years of experience in design, development, and digital strategy.' },
  { icon: <FiGlobe />, title: 'Global Reach', description: 'We serve clients worldwide, bringing international perspectives and best practices to every project.' },
  { icon: <FiAward />, title: 'Proven Results', description: 'Our track record speaks for itself - 65% average ROI increase and 50 NPS score from satisfied clients.' },
  { icon: <FiTrendingUp />, title: 'Growth Focused', description: 'We don\'t just build websites; we create digital experiences that drive measurable business growth.' },
  { icon: <FiClock />, title: 'Ongoing Support', description: 'Our relationship doesn\'t end at launch. We provide ongoing support and maintenance to keep your site performing optimally.' },
]

const process = [
  { step: '01', title: 'Discovery & Strategy', description: 'We dive deep into your business goals, target audience, and competitive landscape to create a comprehensive strategy.' },
  { step: '02', title: 'Design & Prototyping', description: 'Our designers create stunning visual concepts and interactive prototypes that bring your vision to life.' },
  { step: '03', title: 'Development & Testing', description: 'Our developers build your project using cutting-edge technologies while ensuring quality through rigorous testing.' },
  { step: '04', title: 'Launch & Optimization', description: 'We launch your project and continuously optimize for performance, user experience, and business results.' },
]

export default function WhyChooseUs() {
  return (
    <div>
      <section className="section container">
        <div className="badge">Why choose us</div>
        <h2 className="display">Design that moves. Code that scales.</h2>
        <p className="subtitle">We blend delightful motion design with robust engineering to deliver premium results that exceed expectations.</p>

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

      <section className="section container">
        <div className="badge">Our Advantages</div>
        <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>What sets us apart</h2>
        <p className="subtitle">Discover the unique advantages that make Nebula Agency the preferred choice for businesses worldwide.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 22, marginTop: 32 }}>
          {advantages.map((advantage, i) => (
            <motion.div
              key={advantage.title}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ padding: 24 }}
            >
              <div className="badge" style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', marginBottom: 16 }}>{advantage.icon}</div>
              <h3 style={{ marginBottom: 12, fontSize: '1.4rem' }}>{advantage.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="badge">Our Process</div>
        <h2 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)' }}>How we work</h2>
        <p className="subtitle">Our proven four-step process ensures every project is delivered on time, within budget, and exceeds expectations.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 32 }}>
          {process.map((step, i) => (
            <motion.div
              key={step.step}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              style={{ padding: 24, position: 'relative' }}
            >
              <div style={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: 'rgba(177,140,255,0.3)',
                fontFamily: 'monospace'
              }}>
                {step.step}
              </div>
              <h3 style={{ marginBottom: 12, fontSize: '1.4rem', marginRight: '60px' }}>{step.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="cta">
          <h2 className="display" style={{ fontSize: 'clamp(28px, 4vw, 42px)' }}>Ready to get started?</h2>
          <p className="subtitle">Let's discuss your project and see how we can help bring your vision to life.</p>
          <div className="hero-cta">
            <Link className="btn primary" to="/contact">Start a Project</Link>
            <Link className="btn" to="/about">Learn More About Us</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
