'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')
const Gpio = require('onoff').Gpio

function makeMotionSensorThing (pin, identifier, name) {
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    ['MotionSensor'],
    name)
  const value = new Value(false)
  thing.addProperty(
    new Property(thing, 'motion', value, {
      '@type': 'MotionProperty',
      title: 'Motion',
      type: 'boolean',
      description: 'Whether there is motion',
      readOnly: true
    }))
  const input = new Gpio(pin, 'in', 'both')
  let previousValue = false
  let newValue = false
  input.watch((error, v) => {
    if (error) {
      console.log('error', error)
      value.notifyOfExternalUpdate(false)
      return
    }
    newValue = v === 1
    if (newValue !== previousValue) {
      console.log('motion sensor to value', newValue)
      value.notifyOfExternalUpdate(newValue)
      previousValue = newValue
    }
  })
  return thing
}

module.exports = { makeMotionSensorThing }
