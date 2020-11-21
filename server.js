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
  const { humidityThing, temperatureThing, stop } = makeDHTThing(18)
  const server = new WebThingServer(new MultipleThings([blackButtonThing, redButtonThing, kitchenBuzzer, kitchenLamp, humidityThing, temperatureThing],
    'LightAndTempDevice'),
  8888)

  process.on('SIGINT', () => {
    stop()
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })

  server.start().catch(console.error)
}

module.exports = { runServer }
