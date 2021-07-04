'use strict'

const server = require('./kitchen-server')

function runServer () {
  return server.runServer()
}

module.exports = { runServer }
