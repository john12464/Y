import { Link, NavLink } from 'react-router-dom'

const activeStyle = ({ isActive }) => ({
  color: isActive ? '#fff' : 'rgba(255,255,255,0.85)'
})

export default function Navbar() {
  return (
    <div className="nav-inner">
      <Link className="brand" to="/">
        <img src="/logo.svg" alt="Nebula Agency" />
        <span className="title">Nebula Agency</span>
      </Link>
      <nav className="nav-links">
        <NavLink to="/about" style={activeStyle}>About</NavLink>
        <NavLink to="/why-choose-us" style={activeStyle}>Why Choose Us</NavLink>
        <NavLink to="/contact" style={activeStyle}>Contact</NavLink>
        <a className="btn primary" href="#contact">Start a Project</a>
      </nav>
    </div>
  )
}