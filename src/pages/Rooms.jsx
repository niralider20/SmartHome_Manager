import { useState } from 'react'
import { setPower } from '../logic'

function Rooms({ home, setHome }) {
  const [name, setName] = useState('')

  function addRoom(e) {
    e.preventDefault()
    if (name.trim() === '') {
      return
    }
    const room = { id: Date.now(), name: name.trim() }
    setHome({ ...home, rooms: [...home.rooms, room] })
    setName('')
  }

  function deleteRoom(id) {
    let next = home
    for (const d of home.devices) {
      if (d.roomId === id) {
        next = setPower(next, d.id, false, Date.now())
      }
    }
    setHome({
      ...next,
      rooms: next.rooms.filter(r => r.id !== id),
      devices: next.devices.filter(d => d.roomId !== id)
    })
  }

  return (
    <div>
      <h2>Rooms</h2>
      <form className="row" onSubmit={addRoom}>
        <input placeholder="Room name (e.g. Bedroom)" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Add room</button>
      </form>
      {home.rooms.length === 0 && <p className="muted">No rooms yet. Add your first room.</p>}
      {home.rooms.map(room => (
        <div className="item" key={room.id}>
          <span>{room.name}</span>
          <button className="danger" onClick={() => deleteRoom(room.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Rooms
