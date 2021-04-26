async function routes(fastify, options) {
  fastify.post('/auth/register', async (request, reply) => {
    console.log('hit the request')
    return { hello: 'world' }
  })
}

module.exports = routes
