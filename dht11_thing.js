'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')
const dht = require('node-dht-sensor')

function makeDHTThing (pin) {
  const humidityThing = new Thing(
    'urn:dev:ops:kitchen-humidity-sensor-1234',
    'kitchen humidity',
    ['MultiLevelSensor'],
    'A web connected humidity sensor'
  )
  const temperatureThing = new Thing(
    'urn:dev:ops:kitchen-temperature-sensor-1234',
    'kitchen temperature',
    ['MultiLevelSensor'],
    'A web connected temperature sensor'
  )
  const humidityValue = new Value(0.0)
  const temperatureValue = new Value(0.0)
  humidityThing.add_property(
    Property(humidityThing,
      'level',
      humidityValue,
      {
        '@type': 'LevelProperty',
        title: 'Humidity',
        type: 'number',
        description: 'The current humidity in %',
        minimum: 0,
        maximum: 100,
        unit: 'percent',
        readOnly: true
      }))
  temperatureThing.add_property(
    Property(temperatureThing,
      'level',
      temperatureValue,
      {
        '@type': 'LevelProperty',
        title: 'Temperature',
        type: 'number',
        description: 'The current temperature in °C',
        minimum: -5,
        maximum: 50,
        unit: 'celsius',
        readOnly: true
      }))
  dht.read(11, pin, function (err, temperature, humidity) {
    if (!err) {
      console.log(`temp: ${temperature}°C, humidity: ${humidity}%`)
      humidityValue.notifyOfExternalUpdate(humidity)
      temperatureValue.notifyOfExternalUpdate(temperature)
    }
  })
  return { humidityThing, temperatureValue }
}

module.exports = { makeDHTThing }
