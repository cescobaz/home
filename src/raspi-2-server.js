'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeVideoCamera, takeSnapshotRaspi } = require('./lib/video-camera')
const fs = require('fs')

const mediaDirectory = '/tmp/webthing-camera-media'
const imageFilename = 'snapshot.jpg'

function runServer () {
  fs.mkdir(mediaDirectory, { recursive: true }, console.log)
  const { videoCamera, mediaRoute } = makeVideoCamera({
    identifier: 'bedroom-camera-0',
    name: 'bedroom camera',
    dashFilename: 'playlist.mpd',
    imageFilename,
    mediaDirectory,
    takeSnapshot: () => {
      const now = new Date()
      const destinationPath = `${mediaDirectory}/snapshot-${now}.jpg`
      return takeSnapshotRaspi(destinationPath)
    }
  })
  const server = new WebThingServer(new MultipleThings([videoCamera], 'raspi-2'), 8888, null, null, [mediaRoute])
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
