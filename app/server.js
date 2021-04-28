const app = require('./app')

const start = async () => {
  try {
    await app.listen(3000, '0.0.0.0')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
