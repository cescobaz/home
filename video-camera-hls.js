'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')

function makeVideoCameraHLS ({ identifier, name, hlsHref, imageHref }) {
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    ['VideoCamera', 'Camera'],
    name)
  const videoValue = new Value(null, (v) => console.log('video', v))
  thing.addProperty(
    new Property(thing, 'video', videoValue, {
      '@type': 'VideoProperty',
      title: 'Streaming',
      links: [{ rel: 'alternate', mediaType: 'application/vnd.apple.mpegurl', hlsHref }],
      readOnly: true
    }))
  const imageLink = { rel: 'alternate', mediaType: 'image/jpeg', href: imageHref }
  const imageValue = new Value(null, (v) => console.log('snapshot', v))
  thing.addProperty(
    new Property(thing, 'image', imageValue, {
      '@type': 'ImageProperty',
      title: 'Snapshot',
      links: [imageLink],
      readOnly: true
    }))
  return thing
}

module.exports = { makeVideoCameraHLS }
