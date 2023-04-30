'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeButtonThing } = require('./lib/button-thing')
const { makeDHTThing } = require('./lib/dht11-thing')
const { makeLedThing } = require('./lib/led-thing')
const { makeMPL115A2Thing } = require('./lib/mpl115a2-thing')

function createServer () {
  const blackButtonThing = makeButtonThing(17, true, 'black-button-0', 'kitchen black button')
  const redButtonThing = makeButtonThing(27, true, 'red-button-0', 'kitchen red button')
  const kitchenLamp = makeLedThing({ pin: 18, identifier: 'kitchen-lamp-0', name: 'kitchen lamp', isLight: true, inverted: true })
  const kitchenLedRed = makeLedThing({ pin: 10, identifier: 'kitchen-led-red', name: 'kitchen led red', isLight: true })
  const kitchenLedGreen = makeLedThing({ pin: 9, identifier: 'kitchen-led-green', name: 'kitchen led green', isLight: true })
  const { humidityThing, temperatureThing, stop } = makeDHTThing(22)
  const { pressureThing, temperatureThing: temperatureMPL115A2Thing, stop: stopMPL115A2 } = makeMPL115A2Thing()
  const server = new WebThingServer(new MultipleThings([
    blackButtonThing, redButtonThing,
    kitchenLedRed, kitchenLedGreen,
    kitchenLamp,
    humidityThing, temperatureThing,
    pressureThing, temperatureMPL115A2Thing], 'raspi-0'), 8888)
  const dispose = () => Promise.all([stop(), stopMPL115A2()])
  return { dispose, server }
}

module.exports = { createServer }
