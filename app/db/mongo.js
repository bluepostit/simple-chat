const fp = require('fastify-plugin')
const fastifyMongoDb = require('fastify-mongodb')
const MONGODB_URL = process.env.MONGODB_URL

const plugin = async (fastify, options) => {
  fastify.register(fastifyMongoDb, {
    forceClose: true,
    url: MONGODB_URL
  })
}

module.exports = fp(plugin)
