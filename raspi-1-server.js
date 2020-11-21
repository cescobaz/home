'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./led-thing')

function runServer () {
  const livingLamp = makeLedThing({ pin: 17, identifier: 'living-lamp-0', name: 'living lamp', isLight: true, inverted: true })
  const server = new WebThingServer(new MultipleThings([livingLamp], 'raspi-1'), 8888)
  process.on('SIGINT', () => {
    server.stop().then(() => process.exit()).catch(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
