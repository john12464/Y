import { FiCompass, FiLayers, FiPackage, FiRepeat } from 'react-icons/fi'

const steps = [
  { icon: <FiCompass />, title: 'Discover', text: 'Workshops to align on goals, audience, and success metrics.' },
  { icon: <FiLayers />, title: 'Design', text: 'Brand, UI kit, and motion system with real content.' },
  { icon: <FiPackage />, title: 'Build', text: 'Type-safe builds, testing, and performance optimization.' },
  { icon: <FiRepeat />, title: 'Evolve', text: 'Iterate with analytics and experiments after launch.' },
]

export default function Process() {
  return (
    <ol className="process">
      {steps.map((s, i) => (
        <li className="process-step card" key={s.title}>
          <div className="badge" style={{ width: 40, height: 40, display: 'grid', placeItems: 'center' }}>{s.icon}</div>
          <div>
            <h3 style={{ marginBottom: 6 }}>{i + 1}. {s.title}</h3>
            <p className="subtitle" style={{ margin: 0 }}>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}