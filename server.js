const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeBlackButtonThing } = require('./black_button')
const { makeDHTThing } = require('./dht11_thing')

function runServer () {
  const blackButtonThing = makeBlackButtonThing(7)
  const { humidityThing, temperatureThing } = makeDHTThing(18)
  const server = new WebThingServer(new MultipleThings([blackButtonThing, humidityThing, temperatureThing],
    'LightAndTempDevice'),
  8888)

  process.on('SIGINT', () => {
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })

  server.start().catch(console.error)
}

module.exports = { runServer }
