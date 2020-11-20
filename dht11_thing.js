'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')
const dht = require('node-dht-sensor')

function read (pin, humidityValue, temperatureValue) {
  let shouldStop = false
	const stop = () => shouldStop = true
  return function r() {
	if (shouldStop) {
	        return
	}
    dht.read(11, pin, function (error, temperature, humidity) {
      if (error) {
        console.log('error', error)
        setTimeout(r, 2000)
        return
      }
      console.log(`temp: ${temperature}°C, humidity: ${humidity}%`)
      humidityValue.notifyOfExternalUpdate(humidity)
      temperatureValue.notifyOfExternalUpdate(temperature)
      setTimeout(r, 2000)
    })
	  return stop
  }
}

// pin: physical pin
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
  humidityThing.addProperty(
    new Property(humidityThing,
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
  temperatureThing.addProperty(
    new Property(temperatureThing,
      'level',
      temperatureValue,
      {
        '@type': 'LevelProperty',
        title: 'Temperature',
        type: 'number',
        description: 'The current temperature in °C',
        minimum: -5,
        maximum: 40,
        unit: 'celsius',
        readOnly: true
      }))
  const stop = read(pin, humidityValue, temperatureValue)()
  return { humidityThing, temperatureThing, stop }
}

module.exports = { makeDHTThing }
