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

function runServer (locationName, hostname) {
  fs.mkdir(mediaDirectory, { recursive: true }, console.log)
  const { videoCamera, mediaRoute } = makeVideoCameraHLS({
    identifier: `${locationName}-camera-0`,
    name: `${locationName} camera`,
    dashFilename: 'playlist.mpd',
    imageFilename,
    mediaDirectory,
    takeSnapshot: () => {
      const now = new Date()
      const destinationPath = `${mediaDirectory}/snapshot-${now}.jpg`
      return takeSnapshotRaspi(destinationPath, ['--exposure', 'night'])
    }
  })
  const server = new WebThingServer(new MultipleThings([videoCamera], hostname), 8888, null, null, [mediaRoute])
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
