'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')
const MPL115A2 = require('mpl115a2-i2c')

function read (mpl115a2, pressureValue, temperatureValue) {
  return mpl115a2.convert()
    .then(() => mpl115a2.read())
    .then(({ pressure, temperature }) => {
      pressureValue.notifyOfExternalUpdate(pressure.value * 10)
      temperatureValue.notifyOfExternalUpdate(temperature.value)
    })
    .catch(console.log)
}

function makeMPL115A2Thing () {
  const pressureThing = new Thing(
    'urn:dev:ops:kitchen-pressure-sensor-mpl115a2',
    'kitchen pressure',
    ['MultiLevelSensor', 'BarometricPressureSensor'],
    'A web connected pressure sensor mpl115a2'
  )
  const temperatureThing = new Thing(
    'urn:dev:ops:kitchen-temperature-sensor-mpl115a2',
    'kitchen temperature',
    ['MultiLevelSensor', 'TemperatureSensor'],
    'A web connected temperature sensor mpl115a2'
  )
  const pressureValue = new Value(0.0)
  const temperatureValue = new Value(0.0)
  pressureThing.addProperty(
    new Property(pressureThing,
      'level',
      pressureValue,
      {
        '@type': 'BarometricPressureProperty',
        title: 'Pressure',
        type: 'number',
        description: 'The current pressure in hPa',
        minimum: 600,
        maximum: 1200,
        unit: 'hectopascal',
        readOnly: true
      }))
  temperatureThing.addProperty(
    new Property(temperatureThing,
      'level',
      temperatureValue,
      {
        '@type': 'TemperatureProperty',
        type: 'number',
        minimum: -5,
        maximum: 40,
        unit: 'celsius',
        readOnly: true
      }))

  const mpl115a2 = new MPL115A2()
  let ready = false
  mpl115a2.init()
    .then(() => { ready = true })
    .catch(console.log)
  const interval = setInterval(() => {
    if (!ready) {
      return
    }
    read(mpl115a2, pressureValue, temperatureValue)
  }, 3000)
  return { pressureThing, temperatureThing, stop: () => clearInterval(interval) }
}

module.exports = { makeMPL115A2Thing }
