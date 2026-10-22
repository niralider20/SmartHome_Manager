import { useState } from 'react'
import { deviceTypes } from '../deviceTypes'
import { getStatus, setPower } from '../logic'

function Devices({ home, setHome }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('lamp')
  const [roomId, setRoomId] = useState('')

  function addDevice(e) {
    e.preventDefault()
    if (name.trim() === '' || roomId === '') {
      return
    }
    const settings = {}
    for (const s of deviceTypes[type].settings) {
      settings[s.key] = s.value
    }
    const device = {
      id: Date.now(),
      name: name.trim(),
      type: type,
      roomId: Number(roomId),
      connected: false,
      on: false,
      onSince: null,
      status: 'OK',
      settings: settings
    }
    setHome({ ...home, devices: [...home.devices, device] })
    setName('')
  }

  function connect(id) {
    const devices = home.devices.map(d => {
      if (d.id === id) {
        return { ...d, connected: true }
      }
      return d
    })
    setHome({ ...home, devices })
  }

  function remove(id) {
    const next = setPower(home, id, false, Date.now())
    setHome({ ...next, devices: next.devices.filter(d => d.id !== id) })
  }

  if (home.rooms.length === 0) {
    return (
      <div>
        <h2>Devices</h2>
        <p className="muted">Create a room first, then you can add devices to it.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Devices</h2>
      <form className="row" onSubmit={addDevice}>
        <input placeholder="Device name" value={name} onChange={e => setName(e.target.value)} />
        <select value={type} onChange={e => setType(e.target.value)}>
          {Object.keys(deviceTypes).map(key => (
            <option key={key} value={key}>{deviceTypes[key].label}</option>
          ))}
        </select>
        <select value={roomId} onChange={e => setRoomId(e.target.value)}>
          <option value="">Select room</option>
          {home.rooms.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button type="submit">Create device</button>
      </form>
      {home.devices.length === 0 && <p className="muted">No devices yet.</p>}
      {home.devices.map(d => {
        const room = home.rooms.find(r => r.id === d.roomId)
        return (
          <div className="item" key={d.id}>
            <span>
              {d.name} - {deviceTypes[d.type].label} - {room ? room.name : ''} - {getStatus(d)}
            </span>
            <span>
              {!d.connected && <button onClick={() => connect(d.id)}>Connect</button>}
              <button className="danger" onClick={() => remove(d.id)}>Delete</button>
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Devices
