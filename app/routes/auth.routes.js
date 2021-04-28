const Auth = require('../auth')
const DB_NAME = process.env.DB_NAME

const authSchema = {
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

async function routes(fastify, options) {
  const db = await fastify.mongo.client.db(DB_NAME)
  const User = await db.collection('users')

  fastify.post('/auth/register',
    {
      schema: authSchema
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest(
          'You must provide email and password'
        )
      }

      // Create the user
      const hashedPassword = await Auth.hash(password)
      const res = await User.insertOne({ email, password: hashedPassword })
      if (res.insertedCount === 1) {
        return {
          message: 'Registration successful'
        }
      }
      throw fastify.httpErrors.internalServerError()
    }
  )

  fastify.post('/auth/login',
    {
      schema: authSchema
    },
    async (request, reply) => {
      const { email, password } = request.body
      if (!email || !password) {
        throw fastify.httpErrors.badRequest(
          'You must provide email and password'
        )
      }

      const user = await User.findOne({ email })
      const matchingPassword = await Auth.compare(password, user.password)
      if (matchingPassword) {
        return {
          message: 'Login successful'
        }
      }
      throw fastify.httpErrors.unauthorized()
    }
  )
}

module.exports = routes
