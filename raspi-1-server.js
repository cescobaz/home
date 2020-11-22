'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./led-thing')
const { makeVideoCameraHLS } = require('./video-camera-hls')

function runServer () {
  const livingLamp = makeLedThing({ pin: 17, identifier: 'living-lamp-0', name: 'living lamp', isLight: true, inverted: true })
  const picamera = makeVideoCameraHLS({ identifier: 'living-camera-0', name: 'living camera', hlsHref: 'http://raspi-1:8085/playlist.m3u8' })
  const server = new WebThingServer(new MultipleThings([livingLamp, picamera], 'raspi-1'), 8888)
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
