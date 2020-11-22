'use strict'

function main () {
  const args = process.argv

  if (args.length !== 3) {
    console.log('Usage node index.js SERVER_NAME')
    process.exit(1)
  }

  const { runServer } = require(`./${args[2]}`)

  runServer()
}

main()
