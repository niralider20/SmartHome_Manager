import { deviceTypes } from '../deviceTypes'
import { setPower, setSetting, resetDevice, getStatus } from '../logic'

function DeviceCard({ device, home, setHome, user }) {
  const type = deviceTypes[device.type]
  const status = getStatus(device)
  const canChange = user.role === 'Admin' || user.role === 'Child'

  function toggle() {
    setHome(setPower(home, device.id, !device.on, Date.now()))
  }

  function change(setting, value) {
    if (setting.kind === 'range') {
      value = Number(value)
    }
    setHome(setSetting(home, device.id, setting.key, value, Date.now()))
  }

  function reset() {
    setHome(resetDevice(home, device.id, Date.now()))
  }

  return (
    <div className={device.on ? 'card on' : 'card'}>
      <div className="card-top">
        <span className="icon">{type.icon}</span>
        <div>
          <h4>{device.name}</h4>
          <p className="muted">{type.label}</p>
        </div>
      </div>
      <div className="card-status">
        <span className={'badge ' + status.split(' ').join('')}>{status}</span>
        <label className="switch">
          <input type="checkbox" checked={device.on} disabled={home.emergency && !device.on} onChange={toggle} />
          <span className="slider"></span>
        </label>
      </div>
      {home.emergency && !device.on && <p className="muted">Emergency mode is ON</p>}
      {status === 'Malfunctioning' && canChange && (
        <button className="danger" onClick={reset}>Reset device</button>
      )}
      {type.settings.map(s => (
        <div className="field" key={s.key}>
          <label>{s.label}: <b>{device.settings[s.key]}</b></label>
          {s.kind === 'range' && (
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={device.settings[s.key]}
              disabled={!canChange}
              onChange={e => change(s, e.target.value)}
            />
          )}
          {s.kind === 'select' && (
            <select value={device.settings[s.key]} disabled={!canChange} onChange={e => change(s, e.target.value)}>
              {s.options.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          )}
        </div>
      ))}
    </div>
  )
}

export default DeviceCard
