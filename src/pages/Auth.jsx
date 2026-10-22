import { useState } from 'react'
import { save, makeSampleHome } from '../storage'

function Auth({ users, setUsers, setUserId }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [houseName, setHouseName] = useState('')
  const [recovery, setRecovery] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  function go(newMode) {
    setMode(newMode)
    setError('')
    setInfo('')
  }

  function submit(e) {
    e.preventDefault()
    const word = recovery.trim().toLowerCase()

    if (mode === 'login') {
      const found = users.find(u => u.name === name && u.password === password)
      if (!found) {
        setError('Wrong name or password')
        return
      }
      setUserId(found.id)
      return
    }

    if (mode === 'forgot') {
      if (name === '' || word === '' || password === '') {
        setError('Please fill all the fields')
        return
      }
      const found = users.find(u => u.name === name && u.recoveryWord === word)
      if (!found) {
        setError('Name or recovery word is wrong')
        return
      }
      setUsers(users.map(u => {
        if (u.id === found.id) {
          return { ...u, password: password }
        }
        return u
      }))
      setMode('login')
      setPassword('')
      setRecovery('')
      setError('')
      setInfo('Password changed. Please login with your new password.')
      return
    }

    if (name === '' || password === '' || houseName === '' || word === '') {
      setError('Please fill all the fields')
      return
    }
    if (users.find(u => u.name === name)) {
      setError('This name is already taken')
      return
    }
    const id = Date.now()
    const newUser = { id: id, name: name, password: password, recoveryWord: word, role: 'Admin', householdId: id }
    save('sh_home_' + id, makeSampleHome(houseName))
    setUsers([...users, newUser])
    setUserId(id)
  }

  let title = 'Welcome back'
  let button = 'Login'
  if (mode === 'register') {
    title = 'Create your account'
    button = 'Create account'
  }
  if (mode === 'forgot') {
    title = 'Reset your password'
    button = 'Change password'
  }

  return (
    <div className="auth">
      <div className="auth-brand">
        <div className="logo">🏠</div>
        <h1>SmartHome Manager</h1>
        <p>Control and monitor all your home devices from one place.</p>
      </div>
      <form onSubmit={submit}>
        <h2>{title}</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        {mode === 'forgot' && (
          <input placeholder="Recovery word" value={recovery} onChange={e => setRecovery(e.target.value)} />
        )}
        <input
          type="password"
          placeholder={mode === 'forgot' ? 'New password' : 'Password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {mode === 'register' && (
          <input placeholder="Household name" value={houseName} onChange={e => setHouseName(e.target.value)} />
        )}
        {mode === 'register' && (
          <input
            placeholder="Recovery word (to reset password later)"
            value={recovery}
            onChange={e => setRecovery(e.target.value)}
          />
        )}
        {error !== '' && <p className="error">{error}</p>}
        {info !== '' && <p className="success">{info}</p>}
        <button type="submit">{button}</button>
        {mode === 'login' && (
          <button type="button" className="plain" onClick={() => go('forgot')}>Forgot password?</button>
        )}
        {mode === 'login' && (
          <button type="button" className="plain" onClick={() => go('register')}>New here? Register</button>
        )}
        {mode !== 'login' && (
          <button type="button" className="plain" onClick={() => go('login')}>Back to login</button>
        )}
      </form>
    </div>
  )
}

export default Auth
