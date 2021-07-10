'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./lib/led-thing')
const { makeVideoCameraHLS, takeSnapshotRaspi } = require('./lib/video-camera')
const { makeMotionSensorThing } = require('./lib/motion-sensor')
const fs = require('fs')

const mediaDirectory = '/tmp/webthing-camera-media'
const imageFilename = 'snapshot.jpg'

function runServer () {
  fs.mkdir(mediaDirectory, { recursive: true }, console.log)
  const livingLamp = makeLedThing({ pin: 17, identifier: 'living-lamp-0', name: 'living lamp', isLight: true, inverted: true })
  const motionSensor = makeMotionSensorThing(27, 'motion-sensor-living-0', 'living motion sensor')
  const { videoCamera, mediaRoute } = makeVideoCameraHLS({
    identifier: 'living-camera-0',
    name: 'living camera',
    dashFilename: 'playlist.mpd',
    imageFilename,
    mediaDirectory,
    takeSnapshot: () => {
      const now = new Date()
      const destinationPath = `${mediaDirectory}/snapshot-${now}.jpg`
      return takeSnapshotRaspi(destinationPath)
    }
  })
  const server = new WebThingServer(new MultipleThings([livingLamp, videoCamera, motionSensor], 'raspi-1'), 8888, null, null, [mediaRoute])
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
