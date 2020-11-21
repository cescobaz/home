'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./led-thing')

function runServer () {
  const livingLamp = makeLedThing(17, 'living-lamp-0', 'living lamp', true)
  const server = new WebThingServer(new MultipleThings([livingLamp], 'raspi-1'), 8888)
  process.on('SIGINT', () => {
    stop()
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
