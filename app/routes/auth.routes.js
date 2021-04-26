const DB_NAME = process.env.DB_NAME

async function routes(fastify, options) {
  const db = await fastify.mongo.client.db(DB_NAME)
  const User = await db.collection('users')

  fastify.post('/auth/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              pattern: '\\w[\\w+.]+@(\\w+\\.\\w+)+$'
            }
          }
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest(
          'You must provide email and password'
        )
      }

      // Create the user
      const res = await User.insertOne({ email, password })
      if (res.insertedCount === 1) {
        return {
          message: 'Registration successful'
        }
      }
      throw fastify.httpErrors.internalServerError()
    }
  )
}

module.exports = routes
