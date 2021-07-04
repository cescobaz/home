'use strict'

const server = require('./only-camera-server')

function runServer () {
  server.runServer('bedroom-ceil', 'raspi-3')
}

module.exports = { runServer }
