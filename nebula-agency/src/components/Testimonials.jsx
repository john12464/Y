import { motion } from 'framer-motion'

const testimonials = [
  { quote: 'Nebula transformed our brand and site. Conversion up 38%.', author: 'S. Patel', role: 'CMO, Quasar Labs' },
  { quote: 'Their motion design feels magical yet purposeful.', author: 'L. Gomez', role: 'Head of Product, Aurora' },
  { quote: 'Fast, reliable, and a joy to collaborate with.', author: 'K. Nguyen', role: 'Founder, Lyra' },
]

export default function Testimonials() {
  return (
    <div className="testimonials">
      {testimonials.map((t, i) => (
        <motion.blockquote key={t.author} className="card" style={{ padding: 20 }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>“{t.quote}”</p>
          <footer className="subtitle">— {t.author}, {t.role}</footer>
        </motion.blockquote>
      ))}
    </div>
  )
}