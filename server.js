const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeBlackButtonThing } = require('./black_button')

function runServer () {
  const blackButtonThing = makeBlackButtonThing(7)
  const server = new WebThingServer(new MultipleThings([blackButtonThing],
    'LightAndTempDevice'),
  8888)

  process.on('SIGINT', () => {
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })

  server.start().catch(console.error)
}

runServer()
