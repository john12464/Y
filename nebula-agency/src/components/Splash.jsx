import { motion } from 'framer-motion'

export default function Splash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'radial-gradient(800px 600px at 50% 40%, rgba(177,140,255,0.15), transparent 60%), #0d0c1d',
        display: 'grid', placeItems: 'center'
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1.05 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.2 }}
        className="center"
      >
        <img src="/logo.svg" width="80" height="80" alt="Nebula logo" className="floaty" />
      </motion.div>
    </motion.div>
  )
}