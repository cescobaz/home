const {
  Property,
  Thing,
  Value
} = require('webthing')
const Gpio = require('onoff').Gpio

function makeLampThing (pin) {
  const thing = new Thing(
    'urn:dev:ops:kitchen-lamp-1234',
    'kitchen lamp',
    ['OnOffSwitch'],
    'kitchen lamp')
  const lamp = new Gpio(pin, 'out')
  const value = new Value(false, (v) => lamp.writeSync(v ? 1 : 0))
  thing.addProperty(
    new Property(thing, 'on', value, {
      '@type': 'OnOffProperty',
      title: 'On/Off',
      type: 'boolean',
      description: 'Whether the lamp is turned on'
    }))
  return thing
}

module.exports = { makeLampThing }
