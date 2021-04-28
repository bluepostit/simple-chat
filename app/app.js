require('make-promises-safe')
require('../config/environment').load()

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('./db/mongo'))
fastify.register(require('./routes/auth.routes'))

module.exports = fastify
