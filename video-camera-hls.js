'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')
const { exec } = require('child_process')

function takeSnapshotRaspi (destinationPath) {
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

function startDashVideoStreaming (destinationDirectory) {
  return exec(`scripts/raspi-camera-dash-start.sh "${destinationDirectory}"`, (error) => {
    if (error) {
      console.log('startDashVideoStreaming error', error)
    }
  })
}

function makeVideoCameraHLS ({ identifier, name, hlsFilename, dashFilename, imageFilename, mediaDirectory, takeSnapshot }) {
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    ['VideoCamera', 'Camera'],
    name)
  const videoValue = new Value(null)
  const links = []
  if (dashFilename) {
    links.push({ rel: 'alternate', mediaType: 'application/dash+xml', href: `/media/${dashFilename}` })
  }
  if (hlsFilename) {
    links.push({ rel: 'alternate', mediaType: 'application/vnd.apple.mpegurl', href: `/media/${hlsFilename}` })
  }
  thing.addProperty(
    new Property(thing, 'video', videoValue, {
      '@type': 'VideoProperty',
      title: 'Video',
      links,
      readOnly: true
    }))
  let childProcess = null
  const streamingValue = new Value(false, (v) => {
    if (childProcess) {
      childProcess.kill()
      childProcess = null
    }
    if (v) {
      childProcess = startDashVideoStreaming(mediaDirectory)
    }
  })
  thing.addProperty(
    new Property(thing, 'streaming', streamingValue, {
      '@type': 'OnOffProperty',
      type: 'boolean',
      title: 'Streaming'
    }))
  const imageValue = new Value(null)
  thing.addProperty(
    new Property(thing, 'image', imageValue, {
      '@type': 'ImageProperty',
      title: 'Snapshot',
      links: [{ rel: 'alternate', mediaType: 'image/jpeg', href: `/media/${imageFilename}` }],
      readOnly: true
    }))
  const mediaRoute = {
    path: '/media/:file(*)',
    handler: (req, res, next) => {
      const requestedFile = req.params.file
      console.log('media route requested file', requestedFile)
      if (requestedFile === imageFilename) {
        takeSnapshot().then((filePath) => {
          res.download(filePath, function (err) {
            if (err) return next(err)
          })
        }).catch(console.log)
        return
      }
      res.download(`${mediaDirectory}/${requestedFile}`, function (err) {
        if (err) return next(err)
      })
    }
  }
  return { videoCamera: thing, mediaRoute }
}

module.exports = { makeVideoCameraHLS, takeSnapshotRaspi }
