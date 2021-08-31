'use strict'

function main () {
  const args = process.argv

  if (args.length !== 3) {
    console.log('Usage node index.js SERVER_NAME')
    process.exit(1)
  }

  const { createServer } = require(`./src/${args[2]}`)

  const { dispose, server } = createServer()

  process.on('SIGINT', () => {
    Promise.race([
      Promise.all([server.stop(), dispose()]),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ]).finally(() => process.exit())
  })

  return server.start()
}

main()
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
