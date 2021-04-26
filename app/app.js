require('make-promises-safe')

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./routes/auth.routes'))

module.exports = fastify
