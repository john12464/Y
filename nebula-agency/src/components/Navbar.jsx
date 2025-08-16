import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'

const activeStyle = ({ isActive }) => ({
  color: isActive ? '#fff' : 'rgba(255,255,255,0.85)'
})

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <div className="nav-inner">
      <Link className="brand" to="/" aria-label="Nebula Agency home">
        <img src="/logo.svg" alt="Nebula Agency" />
        <span className="title">Nebula Agency</span>
      </Link>
      <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        ☰
      </button>
      <nav className={`nav-links ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <NavLink to="/" style={activeStyle}>Home</NavLink>
        <NavLink to="/about" style={activeStyle}>About</NavLink>
        <NavLink to="/why-choose-us" style={activeStyle}>Why Choose Us</NavLink>
        <NavLink to="/contact" style={activeStyle}>Contact</NavLink>
        <Link className="btn primary" to="/contact">Start a Project</Link>
      </nav>
    </div>
  )
}