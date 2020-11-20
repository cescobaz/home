const {
  Property,
  Thing,
  Value
} = require('webthing')
const Gpio = require('onoff').Gpio

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
  const button = new Gpio(pin, 'in', 'both')
  button.watch((err, v) => {
	  value.notifyOfExternalUpdate(v === 1)
          console.log(v === 1)})
  return thing
}

module.exports = { makeBlackButtonThing }
