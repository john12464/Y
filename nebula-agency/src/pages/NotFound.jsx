import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section container center">
      <div style={{ textAlign: 'center' }}>
        <div className="badge">404</div>
        <h1 className="display">Lost in space</h1>
        <p className="subtitle">The page you’re looking for drifted into a black hole.</p>
        <Link className="btn primary" to="/">Back to home</Link>
      </div>
    </section>
  )
}