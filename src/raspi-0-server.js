'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeButtonThing } = require('./lib/button-thing')
const { makeDHTThing } = require('./lib/dht11-thing')
const { makeLedThing } = require('./lib/led-thing')
>>>>>>> parent of 4c6eedd... files re-organized:raspi-0-server.js

function runServer () {
  const blackButtonThing = makeButtonThing(7, true, 'black-button-0', 'kitchen black button')
  const redButtonThing = makeButtonThing(25, true, 'red-button-0', 'kitchen red button')
  const kitchenLamp = makeLedThing({ pin: 24, identifier: 'kitchen-lamp-0', name: 'kitchen lamp', isLight: true, inverted: true })
  const kitchenBuzzer = makeLedThing({ pin: 8, identifier: 'kitchen-buzzer-0', name: 'kitchen buzzer' })
  const kitchenLed1 = makeLedThing({ pin: 11, identifier: 'kitchen-led-green-1', name: 'kitchen led green 1', isLight: true })
  const kitchenLed2 = makeLedThing({ pin: 9, identifier: 'kitchen-led-green-2', name: 'kitchen led green 2', isLight: true })
  const kitchenLed3 = makeLedThing({ pin: 10, identifier: 'kitchen-led-yellow-3', name: 'kitchen led yellow 3', isLight: true })
  const kitchenLed4 = makeLedThing({ pin: 22, identifier: 'kitchen-led-yellow-4', name: 'kitchen led yellow 4', isLight: true })
  const kitchenLed5 = makeLedThing({ pin: 17, identifier: 'kitchen-led-red-5', name: 'kitchen led red 5', isLight: true })
  const kitchenLed6 = makeLedThing({ pin: 4, identifier: 'kitchen-led-red-6', name: 'kitchen led red 6', isLight: true })
  const { humidityThing, temperatureThing, stop } = makeDHTThing(18)
  const server = new WebThingServer(new MultipleThings([
    blackButtonThing, redButtonThing,
    kitchenLed1, kitchenLed2, kitchenLed3, kitchenLed4, kitchenLed5, kitchenLed6,
    kitchenBuzzer,
    kitchenLamp, humidityThing, temperatureThing], 'raspi-0'), 8888)
  process.on('SIGINT', () => {
    Promise.race([
      stop(),
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
