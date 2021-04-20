async function routes(fastify, options) {
  fastify.get('/auth/register', async (request, reply) => {
    return { hello: 'world' }
  })
}

module.exports = routes
