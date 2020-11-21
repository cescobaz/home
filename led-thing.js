const {
  Property,
  Thing,
  Value
} = require('webthing')
const Gpio = require('onoff').Gpio

function makeLedThing ({ pin, identifier, name, isLight, inverted }) {
  const types = ['OnOffSwitch']
  if (isLight) {
    types.push('Light')
  }
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    types,
    name)
  const lamp = new Gpio(pin, 'out')
  const value = new Value(false || !!inverted, (v) => lamp.writeSync((v && !inverted) ? 1 : 0))
  thing.addProperty(
    new Property(thing, 'on', value, {
      '@type': 'OnOffProperty',
      title: 'On/Off',
      type: 'boolean',
      description: `Whether the ${name} is turned on`
    }))
  return thing
}

module.exports = { makeLedThing }
