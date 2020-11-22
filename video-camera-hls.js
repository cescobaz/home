'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')

function makeVideoCameraHLS ({ identifier, name, hlsFilename, imageFilename, mediaDirectory, takeSnapshot }) {
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    ['VideoCamera', 'Camera'],
    name)
  const videoValue = new Value(null)
  thing.addProperty(
    new Property(thing, 'video', videoValue, {
      '@type': 'VideoProperty',
      title: 'Streaming',
      links: [{ rel: 'alternate', mediaType: 'application/vnd.apple.mpegurl', hlsHref: `${mediaDirectory}/${hlsFilename}` }],
      readOnly: true
    }))
  const imageValue = new Value(null)
  thing.addProperty(
    new Property(thing, 'image', imageValue, {
      '@type': 'ImageProperty',
      title: 'Snapshot',
      links: [{ rel: 'alternate', mediaType: 'image/jpeg', href: `${mediaDirectory}/${imageFilename}` }],
      readOnly: true
    }))
  const mediaRoute = {
    path: '/media/:file(*)',
    handler: (req, res, next) => {
      const requestedFile = req.params.file
      if (requestedFile === imageFilename) {
        takeSnapshot().then(() => {
          res.download(`${mediaDirectory}/${requestedFile}`, function (err) {
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
  return { thing, mediaRoute }
}

module.exports = { makeVideoCameraHLS }
