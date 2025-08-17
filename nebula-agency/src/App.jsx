import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'

import ParticlesBackground from './components/ParticlesBackground.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Splash from './components/Splash.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import WhyChooseUs from './pages/WhyChooseUs.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

function Layout() {
  const location = useLocation()
  return (
    <div className="app-wrapper">
      <ParticlesBackground />
      <header className="navbar">
        <div className="container">
          <Navbar />
        </div>
      </header>
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <Footer />
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      {!isReady && <Splash />}
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="why-choose-us" element={<WhyChooseUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
