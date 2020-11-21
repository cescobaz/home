const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeButtonThing } = require('./button-thing')
const { makeDHTThing } = require('./dht11_thing')
const { makeLedThing } = require('./led-thing')

function runServer () {
  const blackButtonThing = makeButtonThing(7, true, 'black-button-0', 'kitchen black button')
  const redButtonThing = makeButtonThing(25, true, 'red-button-0', 'kitchen red button')
  const kitchenLamp = makeLedThing(24, 'kitchen-lamp-0', 'kitchen lamp')
  const kitchenBuzzer = makeLedThing(8, 'kitchen-buzzer-0', 'kitchen buzzer')
  const kitchenLed1 = makeLedThing(11, 'kitchen-led-green-1', 'kitchen led green 1')
  const kitchenLed2 = makeLedThing(9, 'kitchen-led-green-2', 'kitchen led green 2')
  const kitchenLed3 = makeLedThing(10, 'kitchen-led-yellow-3', 'kitchen led yellow 3')
  const kitchenLed4 = makeLedThing(22, 'kitchen-led-yellow-4', 'kitchen led yellow 4')
  const kitchenLed5 = makeLedThing(17, 'kitchen-led-red-5', 'kitchen led red 5')
  const kitchenLed6 = makeLedThing(4, 'kitchen-led-red-6', 'kitchen led red 6')
  const { humidityThing, temperatureThing, stop } = makeDHTThing(18)
  const server = new WebThingServer(new MultipleThings([
    blackButtonThing, redButtonThing,
    kitchenLed1, kitchenLed2, kitchenLed3, kitchenLed4, kitchenLed5, kitchenLed6,
    kitchenBuzzer,
    kitchenLamp, humidityThing, temperatureThing],
  'LightAndTempDevice'),
  8888)

  process.on('SIGINT', () => {
    stop()
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })

  server.start().catch(console.error)
}

module.exports = { runServer }
