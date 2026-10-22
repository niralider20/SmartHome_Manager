import { useState } from 'react'

function Users({ user, users, setUsers }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Guest')
  const [recovery, setRecovery] = useState('')
  const [error, setError] = useState('')

  const members = users.filter(u => u.householdId === user.householdId)

  function addMember(e) {
    e.preventDefault()
    if (name.trim() === '' || password === '' || recovery.trim() === '') {
      setError('Please fill all the fields')
      return
    }
    if (users.find(u => u.name === name.trim())) {
      setError('This name is already taken')
      return
    }
    const member = {
      id: Date.now(),
      name: name.trim(),
      password: password,
      recoveryWord: recovery.trim().toLowerCase(),
      role: role,
      householdId: user.householdId
    }
    setUsers([...users, member])
    setName('')
    setPassword('')
    setRecovery('')
    setError('')
  }

  function remove(id) {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <div>
      <h2>Household Members</h2>
      <form className="row" onSubmit={addMember}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input placeholder="Recovery word" value={recovery} onChange={e => setRecovery(e.target.value)} />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Guest">Guest</option>
          <option value="Child">Child</option>
        </select>
        <button type="submit">Add member</button>
      </form>
      {error !== '' && <p className="error">{error}</p>}
      {members.map(m => (
        <div className="item" key={m.id}>
          <span>{m.name} - {m.role}</span>
          {m.id !== user.id && <button className="danger" onClick={() => remove(m.id)}>Delete</button>}
        </div>
      ))}
    </div>
  )
}

export default Users
