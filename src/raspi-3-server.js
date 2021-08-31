'use strict'

const server = require('./only-camera-server')

function createServer () {
  return server.createServer('bedroom-ceil', 'raspi-3')
}

module.exports = { createServer }
