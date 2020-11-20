const {
  Property,
  Thing,
  Value
} = require('webthing')
const rpio = require('rpio')

function makeBlackButtonThing (pin) {
  const thing = new Thing(
    'urn:dev:ops:black-button-0',
    'kitchen black button',
    ['PushButton'],
    'kitchen black button')
  const value = new Value(false)
  thing.addProperty(
    new Property(thing, 'pushed', value, {
      '@type': 'PushedProperty',
      title: 'Pushed',
      type: 'boolean',
      description: 'Whether the button is pressed',
      readOnly: true
    }))
  rpio.open(pin, rpio.INPUT)
  rpio.poll(pin, () => value.notifyOfExternalUpdate(rpio.read(pin) === 1))
  return thing
}

module.exports = { makeBlackButtonThing }
