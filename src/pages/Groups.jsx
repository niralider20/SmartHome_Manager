import { useState } from 'react'
import { setPower } from '../logic'

function Groups({ home, setHome, user }) {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState([])

  function pick(id) {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  function addGroup(e) {
    e.preventDefault()
    if (name.trim() === '' || selected.length === 0) {
      return
    }
    const group = { id: Date.now(), name: name.trim(), deviceIds: selected }
    setHome({ ...home, groups: [...home.groups, group] })
    setName('')
    setSelected([])
  }

  function runGroup(group, on) {
    let next = home
    for (const id of group.deviceIds) {
      next = setPower(next, id, on, Date.now())
    }
    setHome(next)
  }

  function remove(id) {
    setHome({ ...home, groups: home.groups.filter(g => g.id !== id) })
  }

  return (
    <div>
      <h2>Device Groups</h2>
      {user.role === 'Admin' && (
        <form onSubmit={addGroup}>
          <div className="row">
            <input placeholder="Group name (e.g. Morning Routine)" value={name} onChange={e => setName(e.target.value)} />
            <button type="submit">Create group</button>
          </div>
          <div className="checks">
            {home.devices.map(d => (
              <label key={d.id}>
                <input type="checkbox" checked={selected.includes(d.id)} onChange={() => pick(d.id)} />
                {d.name}
              </label>
            ))}
          </div>
        </form>
      )}
      {home.groups.length === 0 && <p className="muted">No groups yet.</p>}
      {home.groups.map(g => {
        const names = []
        for (const id of g.deviceIds) {
          const device = home.devices.find(d => d.id === id)
          if (device) {
            names.push(device.name)
          }
        }
        return (
          <div className="item" key={g.id}>
            <span>{g.name}: {names.join(', ')}</span>
            <span>
              <button onClick={() => runGroup(g, true)}>Turn on</button>
              <button onClick={() => runGroup(g, false)}>Turn off</button>
              {user.role === 'Admin' && <button className="danger" onClick={() => remove(g.id)}>Delete</button>}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default Groups
