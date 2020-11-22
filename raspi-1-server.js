'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./led-thing')
const { makeVideoCameraHLS, takeSnapshotRaspi } = require('./video-camera-hls')

const mediaDirectory = '/tmp/webthing-camera-media'
const imageFilename = 'snapshot.jpg'

function runServer () {
  const livingLamp = makeLedThing({ pin: 16, identifier: 'living-lamp-0', name: 'living lamp', isLight: true, inverted: true })
  const { videoCamera, mediaRoute } = makeVideoCameraHLS({
    identifier: 'living-camera-0',
    name: 'living camera',
    dashFilename: 'playlist.mpd',
    hlsFilename: 'playlist.m3u8',
    imageFilename,
    mediaDirectory,
    takeSnapshot: () => {
      const now = new Date()
      const destinationPath = `${mediaDirectory}/snapshot-${now}.jpg`
      return takeSnapshotRaspi(destinationPath)
    }
  })
  const server = new WebThingServer(new MultipleThings([livingLamp, videoCamera], 'raspi-1'), 8888, null, null, [mediaRoute])
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
