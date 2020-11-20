const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeBlackButtonThing } = require('./black_button')
const { makeDHTThing } = require('./dht11_thing')
const { makeLampThing } = require('./kitchen_lamp')

function runServer () {
  const blackButtonThing = makeBlackButtonThing(7)
  const kitchenLamp = makeLampThing(24)
  const { humidityThing, temperatureThing, stop } = makeDHTThing(18)
  const server = new WebThingServer(new MultipleThings([blackButtonThing, kitchenLamp, humidityThing, temperatureThing],
    'LightAndTempDevice'),
  8888)

  process.on('SIGINT', () => {
	  stop()
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })

  server.start().catch(console.error)
}

module.exports = { runServer }
