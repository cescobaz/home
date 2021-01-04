'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./lib/led-thing')
const { makeVideoCameraHLS, takeSnapshotRaspi } = require('./lib/video-camera')
const fs = require('fs')

const mediaDirectory = '/tmp/webthing-camera-media'
const imageFilename = 'snapshot.jpg'

function runServer () {
  fs.mkdir(mediaDirectory, { recursive: true }, console.log)
  const led = makeLedThing({ pin: 4, identifier: 'bedroom-ceil-led-0', name: 'bedroom ceil led', isLight: true, inverted: false })
  const { videoCamera, mediaRoute } = makeVideoCameraHLS({
    identifier: 'bedroom-ceil-camera-0',
    name: 'bedroom ceil camera',
    dashFilename: 'playlist.mpd',
    imageFilename,
    mediaDirectory,
    takeSnapshot: () => {
      const now = new Date()
      const destinationPath = `${mediaDirectory}/snapshot-${now}.jpg`
      return takeSnapshotRaspi(destinationPath, ['--exposure', 'night'])
    }
  })
  const server = new WebThingServer(new MultipleThings([led, videoCamera], 'raspi-2'), 8888, null, null, [mediaRoute])
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
