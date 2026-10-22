import { useState } from 'react'
import { deviceTypes } from '../deviceTypes'

function Routines({ home, setHome }) {
  const [name, setName] = useState('')
  const [time, setTime] = useState('')
  const [action, setAction] = useState('off')
  const [value, setValue] = useState(24)
  const [types, setTypes] = useState([])

  function pickType(key) {
    if (types.includes(key)) {
      setTypes(types.filter(t => t !== key))
    } else {
      setTypes([...types, key])
    }
  }

  function addRoutine(e) {
    e.preventDefault()
    if (name.trim() === '' || time === '' || types.length === 0) {
      return
    }
    const routine = { id: Date.now(), name: name.trim(), time, action, value: Number(value), types, lastRun: '' }
    setHome({ ...home, routines: [...home.routines, routine] })
    setName('')
    setTypes([])
  }

  function remove(id) {
    setHome({ ...home, routines: home.routines.filter(r => r.id !== id) })
  }

  function describe(r) {
    let text = 'Turn off'
    if (r.action === 'on') {
      text = 'Turn on'
    }
    if (r.action === 'temperature') {
      text = 'Set temperature to ' + r.value + '°C for'
    }
    const names = r.types.map(t => deviceTypes[t].label)
    return r.time + ' - ' + text + ' ' + names.join(', ')
  }

  return (
    <div>
      <h2>Routines</h2>
      <form onSubmit={addRoutine}>
        <div className="row">
          <input placeholder="Routine name" value={name} onChange={e => setName(e.target.value)} />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          <select value={action} onChange={e => setAction(e.target.value)}>
            <option value="off">Turn off</option>
            <option value="on">Turn on</option>
            <option value="temperature">Set temperature</option>
          </select>
          {action === 'temperature' && (
            <input type="number" min="18" max="30" value={value} onChange={e => setValue(e.target.value)} />
          )}
        </div>
        <div className="checks">
          {Object.keys(deviceTypes).map(key => (
            <label key={key}>
              <input type="checkbox" checked={types.includes(key)} onChange={() => pickType(key)} />
              {deviceTypes[key].label}
            </label>
          ))}
        </div>
        <button type="submit">Add routine</button>
      </form>
      {home.routines.length === 0 && <p className="muted">No routines yet.</p>}
      {home.routines.map(r => (
        <div className="item" key={r.id}>
          <span>{r.name}: {describe(r)}</span>
          <button className="danger" onClick={() => remove(r.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Routines
