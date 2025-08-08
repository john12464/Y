import { FaXTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa6'

export default function Footer() {
  return (
    <div className="footer-inner container">
      <small>© {new Date().getFullYear()} Nebula Agency. All rights reserved.</small>
      <div className="socials">
        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer"><FaXTwitter /></a>
        <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
      </div>
    </div>
  )
}