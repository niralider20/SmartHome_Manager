import { getUsage, getPredictions, getTips } from '../logic'

function Energy({ home, now }) {
  let total = 0
  const rows = []
  for (const d of home.devices) {
    const usage = getUsage(home, d, now)
    total += usage.kwh
    rows.push({ id: d.id, name: d.name, hours: usage.hours, kwh: usage.kwh })
  }
  const tips = getTips(home, now)
  const predictions = getPredictions(home)

  return (
    <div>
      <h2>Energy Usage (this week)</h2>
      {rows.length === 0 && <p className="muted">No devices yet.</p>}
      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Hours used</th>
              <th>Energy (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.hours.toFixed(1)}</td>
                <td>{r.kwh.toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td><b>Total</b></td>
              <td></td>
              <td><b>{total.toFixed(2)}</b></td>
            </tr>
          </tbody>
        </table>
      )}
      <h3>Energy saving tips</h3>
      {tips.length === 0 && <p className="muted">No tips right now.</p>}
      {tips.map((t, i) => (
        <p className="item" key={i}>{t}</p>
      ))}
      <h3>Usage predictions</h3>
      {predictions.length === 0 && <p className="muted">Not enough usage data yet.</p>}
      {predictions.map((p, i) => (
        <p className="item" key={i}>{p}</p>
      ))}
    </div>
  )
}

export default Energy
