import { useState, useEffect } from 'react'
import { load, save, emptyHome } from './storage'
import { runRoutines, checkMalfunctions } from './logic'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Devices from './pages/Devices'
import Routines from './pages/Routines'
import Groups from './pages/Groups'
import Energy from './pages/Energy'
import Voice from './pages/Voice'
import Users from './pages/Users'

function App() {
  const [users, setUsers] = useState(load('sh_users', []))
  const [userId, setUserId] = useState(load('sh_current', null))
  const [home, setHome] = useState(null)
  const [page, setPage] = useState('Dashboard')
  const [now, setNow] = useState(Date.now())

  const user = users.find(u => u.id === userId)

  useEffect(() => {
    save('sh_users', users)
  }, [users])

  useEffect(() => {
    save('sh_current', userId)
  }, [userId])

  useEffect(() => {
    if (user) {
      setHome(load('sh_home_' + user.householdId, emptyHome))
    } else {
      setHome(null)
    }
  }, [userId])

  useEffect(() => {
    if (user && home) {
      save('sh_home_' + user.householdId, home)
    }
  }, [home])

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!home) {
      return
    }
    let next = runRoutines(home, now)
    next = checkMalfunctions(next, now)
    if (next !== home) {
      setHome(next)
    }
  }, [now, home])

  function logout() {
    setUserId(null)
    setPage('Dashboard')
  }

  if (!user) {
    return <Auth users={users} setUsers={setUsers} setUserId={setUserId} />
  }

  if (!home) {
    return null
  }

  let pages = ['Dashboard', 'Groups', 'Energy', 'Voice']
  if (user.role === 'Admin') {
    pages = ['Dashboard', 'Rooms', 'Devices', 'Routines', 'Groups', 'Energy', 'Voice', 'Users']
  }

  const props = { home, setHome, user, users, setUsers, now }

  return (
    <div>
      <header className="top">
        <div className="inner">
          <div>
            <h1>🏠 {home.name}</h1>
            <p>{user.name} · {user.role}</p>
          </div>
          <button className="light" onClick={logout}>Logout</button>
        </div>
      </header>
      <nav>
        {pages.map(p => (
          <button key={p} className={p === page ? 'tab active' : 'tab'} onClick={() => setPage(p)}>
            {p}
          </button>
        ))}
      </nav>
      <main>
        {page === 'Dashboard' && <Dashboard {...props} />}
        {page === 'Rooms' && <Rooms {...props} />}
        {page === 'Devices' && <Devices {...props} />}
        {page === 'Routines' && <Routines {...props} />}
        {page === 'Groups' && <Groups {...props} />}
        {page === 'Energy' && <Energy {...props} />}
        {page === 'Voice' && <Voice {...props} />}
        {page === 'Users' && <Users {...props} />}
      </main>
    </div>
  )
}

export default App
