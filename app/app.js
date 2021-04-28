require('make-promises-safe')
require('../config/environment').load()

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('fastify-sensible'))
fastify.register(require('./db/mongo'))
fastify.register(require('./routes/auth.routes'))

module.exports = fastify
