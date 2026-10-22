import DeviceCard from '../components/DeviceCard'
import { setPower } from '../logic'

function Dashboard({ home, setHome, user }) {
  const connected = home.devices.filter(d => d.connected)
  const running = connected.filter(d => d.on)

  function startEmergency() {
    let next = home
    for (const d of home.devices) {
      next = setPower(next, d.id, false, Date.now())
    }
    setHome({ ...next, emergency: true })
  }

  function stopEmergency() {
    setHome({ ...home, emergency: false })
  }

  function clearAlerts() {
    setHome({ ...home, alerts: [] })
  }

  const alerts = [...home.alerts].reverse()

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat"><b>{home.rooms.length}</b><span>Rooms</span></div>
        <div className="stat"><b>{connected.length}</b><span>Connected devices</span></div>
        <div className="stat"><b>{running.length}</b><span>Running now</span></div>
        <div className="stat"><b>{home.alerts.length}</b><span>Alerts</span></div>
      </div>
      {home.emergency ? (
        <div className="emergency">
          <p>🚨 Emergency mode is ON. All appliances are switched off and cannot be turned on.</p>
          {user.role === 'Admin' && <button onClick={stopEmergency}>Turn off emergency mode</button>}
        </div>
      ) : (
        user.role === 'Admin' && (
          <button className="danger" onClick={startEmergency}>🚨 Start emergency mode</button>
        )
      )}
      {alerts.length > 0 && (
        <div className="alerts">
          <h3>⚠️ Alerts</h3>
          {alerts.map(a => (
            <p key={a.id}>{new Date(a.time).toLocaleTimeString()} - {a.message}</p>
          ))}
          {user.role === 'Admin' && <button className="plain" onClick={clearAlerts}>Clear alerts</button>}
        </div>
      )}
      {home.rooms.length === 0 && <p className="muted">No rooms yet. Ask an admin to set up rooms and devices.</p>}
      {home.rooms.map(room => {
        const list = home.devices.filter(d => d.roomId === room.id && d.connected)
        return (
          <div key={room.id}>
            <h3 className="room-title">{room.name}</h3>
            {list.length === 0 && <p className="muted">No connected devices</p>}
            <div className="cards">
              {list.map(d => (
                <DeviceCard key={d.id} device={d} home={home} setHome={setHome} user={user} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Dashboard
