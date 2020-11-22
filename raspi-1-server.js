'use strict'

const {
  MultipleThings,
  WebThingServer
} = require('webthing')
const { makeLedThing } = require('./led-thing')
const { makeVideoCameraHLS } = require('./video-camera-hls')
const { exec } = require('child_process')

const mediaDirectory = '/tmp/hls'
const imageFilename = 'snapshot.jpg'

function takeSnapshot (destinationPath) {
  return new Promise((resolve, reject) => {
    exec(`raspistill -o "${destinationPath}"`, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(destinationPath)
    })
  })
}

function runServer () {
  const livingLamp = makeLedThing({ pin: 16, identifier: 'living-lamp-0', name: 'living lamp', isLight: true, inverted: true })
  const picamera = makeVideoCameraHLS({
    identifier: 'living-camera-0',
    name: 'living camera',
    hlsFilename: 'playlist.m3u8',
    imageFilename,
    takeSnapshot: () => takeSnapshot(`${mediaDirectory}/${imageFilename}`)
  })
  const routes = [
    {
      path: '/snapshot.jpg',
      handler: (req, res, next) => {
        res.download('/tmp/hls/snapshot.jpg', function (err) {
          if (err) return next(err)
        })
      }
    }
  ]
  const server = new WebThingServer(new MultipleThings([livingLamp, picamera], 'raspi-1'), 8888, null, null, routes)
  process.on('SIGINT', () => {
    Promise.race([
      server.stop(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })
  server.start().catch(console.error)
}

module.exports = { runServer }
