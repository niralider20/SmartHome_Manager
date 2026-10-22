import { deviceTypes } from './deviceTypes'

export const DEMO_HOUR = 1000

export function getStatus(device) {
  if (!device.connected) {
    return 'Not Connected'
  }
  if (device.status === 'Malfunctioning') {
    return 'Malfunctioning'
  }
  if (device.on) {
    return 'On'
  }
  return 'In Standby'
}

export function setPower(home, id, on, now) {
  const device = home.devices.find(d => d.id === id)
  if (!device || !device.connected || device.on === on) {
    return home
  }
  if (on && (home.emergency || device.status === 'Malfunctioning')) {
    return home
  }
  let sessions = home.sessions
  if (!on) {
    sessions = [...sessions, { deviceId: id, start: device.onSince, end: now }]
  }
  const devices = home.devices.map(d => {
    if (d.id === id) {
      return { ...d, on: on, onSince: on ? now : null }
    }
    return d
  })
  const logs = [...home.logs, { deviceId: id, action: on ? 'on' : 'off', time: now }].slice(-200)
  return { ...home, devices, sessions, logs }
}

export function setSetting(home, id, key, value, now) {
  const devices = home.devices.map(d => {
    if (d.id === id) {
      return { ...d, settings: { ...d.settings, [key]: value } }
    }
    return d
  })
  const logs = [...home.logs, { deviceId: id, action: 'setting', time: now }].slice(-200)
  return { ...home, devices, logs }
}

export function resetDevice(home, id, now) {
  let next = setPower(home, id, false, now)
  const devices = next.devices.map(d => {
    if (d.id === id) {
      return { ...d, status: 'OK' }
    }
    return d
  })
  return { ...next, devices }
}

export function turnTypes(home, types, action, value, now) {
  let next = home
  for (const d of home.devices) {
    if (!d.connected || !types.includes(d.type)) {
      continue
    }
    if (action === 'on') {
      next = setPower(next, d.id, true, now)
    }
    if (action === 'off') {
      next = setPower(next, d.id, false, now)
    }
    if (action === 'temperature' && d.settings.temperature !== undefined) {
      next = setSetting(next, d.id, 'temperature', value, now)
    }
  }
  return next
}

export function runRoutines(home, now) {
  const date = new Date(now)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const time = hours + ':' + minutes
  const key = date.toDateString() + time
  let next = home
  let changed = false
  const routines = []
  for (const r of home.routines) {
    if (r.time === time && r.lastRun !== key) {
      next = turnTypes(next, r.types, r.action, r.value, now)
      routines.push({ ...r, lastRun: key })
      changed = true
    } else {
      routines.push(r)
    }
  }
  if (!changed) {
    return home
  }
  return { ...next, routines }
}

export function checkMalfunctions(home, now) {
  let changed = false
  const devices = []
  const alerts = [...home.alerts]
  for (const d of home.devices) {
    if (d.on && d.status !== 'Malfunctioning') {
      const hours = (now - d.onSince) / DEMO_HOUR
      if (hours > deviceTypes[d.type].maxHours) {
        const message = d.name + ' has been on for ' + Math.floor(hours) + ' hours. Please reset the device.'
        alerts.push({ id: now + d.id, message: message, time: now })
        devices.push({ ...d, status: 'Malfunctioning' })
        changed = true
        continue
      }
    }
    devices.push(d)
  }
  if (!changed) {
    return home
  }
  return { ...home, devices, alerts }
}

export function getUsage(home, device, now) {
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000
  let ms = 0
  for (const s of home.sessions) {
    if (s.deviceId === device.id && s.end > weekAgo) {
      ms += s.end - Math.max(s.start, weekAgo)
    }
  }
  if (device.on) {
    ms += now - device.onSince
  }
  const hours = ms / DEMO_HOUR
  const kwh = (hours * deviceTypes[device.type].watts) / 1000
  return { hours, kwh }
}

export function getPredictions(home) {
  const counts = {}
  for (const log of home.logs) {
    if (log.action === 'off') {
      continue
    }
    const hour = new Date(log.time).getHours()
    const key = log.deviceId + '-' + log.action + '-' + hour
    if (counts[key]) {
      counts[key].count += 1
    } else {
      counts[key] = { deviceId: log.deviceId, action: log.action, hour: hour, count: 1 }
    }
  }
  const result = []
  for (const key in counts) {
    const item = counts[key]
    const device = home.devices.find(d => d.id === item.deviceId)
    if (item.count >= 3 && device) {
      const what = item.action === 'on' ? ' is usually turned on' : ' settings are usually changed'
      result.push(device.name + what + ' around ' + item.hour + ':00. You can create a routine for it.')
    }
  }
  return result
}

export function getTips(home, now) {
  const tips = []
  for (const d of home.devices) {
    const usage = getUsage(home, d, now)
    if (usage.kwh > 5) {
      tips.push(d.name + ' used ' + usage.kwh.toFixed(1) + ' kWh this week. Try to use it less.')
    }
    if (d.on && d.settings.temperature !== undefined && d.settings.temperature < 22) {
      tips.push(d.name + ' is set below 22°C. Setting it to 24°C or higher saves energy.')
    }
  }
  let night = false
  for (const log of home.logs) {
    const hour = new Date(log.time).getHours()
    if (log.action === 'on' && (hour >= 22 || hour < 5)) {
      night = true
    }
  }
  if (night) {
    tips.push('Devices are turned on at night. Create a sleep mode routine to switch off unneeded appliances.')
  }
  return tips
}

export function runCommand(home, text, now) {
  const lower = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ')
  const words = lower.split(' ').filter(w => w !== '')
  let on
  if (words.includes('on')) {
    on = true
  } else if (words.includes('off')) {
    on = false
  } else {
    return { home: home, reply: 'Sorry, I did not understand. Say turn on or turn off.' }
  }
  if (on && home.emergency) {
    return { home: home, reply: 'Emergency mode is ON. Devices cannot be turned on.' }
  }
  let next = home
  let count = 0
  for (const d of home.devices) {
    let match = lower.includes('all devices') || lower.includes('everything') || lower.includes(d.name.toLowerCase())
    for (const word of deviceTypes[d.type].keywords) {
      if (words.includes(word)) {
        match = true
      }
    }
    if (match) {
      const result = setPower(next, d.id, on, now)
      if (result !== next) {
        next = result
        count += 1
      }
    }
  }
  if (count === 0) {
    return { home: home, reply: 'No devices were changed.' }
  }
  return { home: next, reply: 'Turned ' + (on ? 'on' : 'off') + ' ' + count + ' device(s).' }
}
