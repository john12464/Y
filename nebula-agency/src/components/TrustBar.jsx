export default function TrustBar() {
  const logos = ['ORION', 'LYRA', 'QUASAR', 'PULSAR', 'AURORA']
  return (
    <div className="trust-bar">
      {logos.map(name => (
        <div key={name} className="trust-item" aria-label={`Client ${name}`}>{name}</div>
      ))}
    </div>
  )
}