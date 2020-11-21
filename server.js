const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeButtonThing } = require('./button-thing')
const { makeDHTThing } = require('./dht11_thing')
const { makeLampThing } = require('./kitchen_lamp')

function runServer () {
  const blackButtonThing = makeButtonThing(7, true, 'black-button-0', 'kitchen black button')
  const redButtonThing = makeButtonThing(25, true, 'red-button-0', 'kitchen red button')
  const kitchenLamp = makeLampThing(24)
  const { humidityThing, temperatureThing, stop } = makeDHTThing(18)
  const server = new WebThingServer(new MultipleThings([blackButtonThing, redButtonThing, kitchenLamp, humidityThing, temperatureThing],
    'LightAndTempDevice'),
  8888)

  process.on('SIGINT', () => {
    stop()
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })

  server.start().catch(console.error)
}

module.exports = { runServer }
