import { deviceTypes } from './deviceTypes'

export const emptyHome = {
  name: '',
  rooms: [],
  devices: [],
  routines: [],
  groups: [],
  sessions: [],
  logs: [],
  alerts: [],
  emergency: false
}

export function load(key, fallback) {
  const text = localStorage.getItem(key)
  if (text) {
    return JSON.parse(text)
  }
  return fallback
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function makeDevice(id, name, type, roomId) {
  const settings = {}
  for (const s of deviceTypes[type].settings) {
    settings[s.key] = s.value
  }
  return {
    id: id,
    name: name,
    type: type,
    roomId: roomId,
    connected: true,
    on: false,
    onSince: null,
    status: 'OK',
    settings: settings
  }
}

export function makeSampleHome(name) {
  const rooms = [
    { id: 1, name: 'Living Room' },
    { id: 2, name: 'Bedroom' },
    { id: 3, name: 'Kitchen' }
  ]
  const devices = [
    makeDevice(101, 'Living Room Lamp', 'lamp', 1),
    makeDevice(102, 'Ceiling Fan', 'fan', 1),
    makeDevice(103, 'TV', 'tv', 1),
    makeDevice(104, 'Smart AC', 'ac', 1),
    makeDevice(105, 'Bedroom Lamp', 'lamp', 2),
    makeDevice(106, 'Thermostat', 'thermostat', 2),
    makeDevice(107, 'Heater', 'heater', 2),
    makeDevice(108, 'Coffee Maker', 'coffee', 3),
    makeDevice(109, 'Washing Machine', 'washer', 3)
  ]
  return { ...emptyHome, name: name, rooms: rooms, devices: devices }
}
