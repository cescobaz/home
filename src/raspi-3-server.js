'use strict'

const server = require('./src/only-camera-server')

function runServer () {
  server.runServer('bedroom-ceil', 'raspi-3')
}

module.exports = { runServer }
