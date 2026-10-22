const temperature = { key: 'temperature', label: 'Temperature (°C)', kind: 'range', min: 18, max: 30, value: 24 }

export const deviceTypes = {
  lamp: {
    label: 'Smart Lamp',
    icon: '💡',
    watts: 10,
    maxHours: 72,
    keywords: ['light', 'lights', 'lamp', 'lamps'],
    settings: [
      { key: 'brightness', label: 'Brightness (%)', kind: 'range', min: 0, max: 100, value: 50 },
      { key: 'color', label: 'Color Mode', kind: 'select', options: ['Warm', 'Cold'], value: 'Warm' }
    ]
  },
  fan: {
    label: 'Ceiling Fan',
    icon: '🌀',
    watts: 60,
    maxHours: 48,
    keywords: ['fan', 'fans'],
    settings: [
      { key: 'speed', label: 'Speed', kind: 'select', options: ['Low', 'Medium', 'High'], value: 'Low' }
    ]
  },
  thermostat: {
    label: 'Thermostat',
    icon: '🌡️',
    watts: 100,
    maxHours: 72,
    keywords: ['thermostat'],
    settings: [temperature]
  },
  ac: {
    label: 'Smart AC',
    icon: '❄️',
    watts: 1200,
    maxHours: 24,
    keywords: ['ac'],
    settings: [temperature]
  },
  heater: {
    label: 'Heater',
    icon: '🔥',
    watts: 1500,
    maxHours: 24,
    keywords: ['heater', 'heaters'],
    settings: [temperature]
  },
  washer: {
    label: 'Washing Machine',
    icon: '🧺',
    watts: 500,
    maxHours: 3,
    keywords: ['washer', 'washing'],
    settings: [
      { key: 'mode', label: 'Mode', kind: 'select', options: ['Normal', 'Quick', 'Heavy'], value: 'Normal' }
    ]
  },
  coffee: {
    label: 'Coffee Maker',
    icon: '☕',
    watts: 800,
    maxHours: 2,
    keywords: ['coffee'],
    settings: []
  },
  tv: {
    label: 'TV',
    icon: '📺',
    watts: 100,
    maxHours: 24,
    keywords: ['tv'],
    settings: []
  }
}
