'use strict'

const {
  Property,
  Thing,
  Value
} = require('webthing')

function makeVideoCameraHLS ({ identifier, name, hlsHref }) {
  const thing = new Thing(
    `urn:dev:ops:${identifier}`,
    name,
    ['VideoCamera', 'Camera'],
    name)
  thing.addProperty(
    new Property(thing, 'pushed', null, {
      '@type': 'VideoProperty',
      title: 'Streaming',
      links: [{ rel: 'alternate', mediaType: 'application/vnd.apple.mpegurl', hlsHref: '' }],
      description: 'Whether the button is pressed',
      readOnly: true
    }))
  thing.addProperty(
    new Property(thing, 'image', null, {
      '@type': 'ImageProperty',
      title: 'Snapshot',
      readOnly: true
    }))
  return thing
}

module.exports = { makeVideoCameraHLS }
